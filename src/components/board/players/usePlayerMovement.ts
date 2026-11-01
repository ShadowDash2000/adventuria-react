import { type RefObject, useEffect, useRef, useState } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useBoardInnerContext } from '@components/board';
import { useAppContext } from '@context/AppContext';
import { BoardHelper, type CellPosition } from '../BoardHelper';
import { CELL_MAX_PLAYERS, CELL_MAX_PLAYERS_LINE } from '../Board';
import { usePlayer } from '@components/board/players/usePlayer';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';
import { usePlayersStore, type PlayerPosition } from './usePlayersStore';

interface PlayerMovementProps {
    playerId: RecordIdString;
    playerProgress: PlayerProgress;
    playerRef: RefObject<HTMLElement | null>;
}

interface PlayerMovementReturn {
    position: PlayerPosition;
    moving: boolean;
    moveTime: number;
    visible: boolean;
}

type PlayerProgress = { currentWorld: RecordIdString; cellsPassed: number; updated?: number };

const SCROLL_INTERVAL = 50;
const EMPTY_POSITION: PlayerPosition = { x: 0, y: 0, offsetX: 0, offsetY: 0 };

export const usePlayerMovement = ({
    playerId,
    playerProgress,
    playerRef,
}: PlayerMovementProps): PlayerMovementReturn => {
    const { playerId: authPlayerId } = useAppContext();
    const { cellWidth, cellHeight, worldsById } = useBoardInnerContext();
    const isCurrentPlayer = authPlayerId ? playerId === authPlayerId : false;
    const [moving, setMoving] = useState<boolean>(false);
    const { incrementBlocked, decrementBlocked } = useKbdSettings(KbdKey.inventory);

    const {
        playerState,
        getPlayerState,
        setPlayerState,
        pullPath,
        paths,
        moveTime,
        clearMoveTime,
    } = usePlayer(playerId);
    const playerStates = usePlayersStore(state => state.playerStates);

    const isMovingRef = useRef(false);
    const startedMovementRef = useRef(false);
    const nextStepAtRef = useRef<number | null>(null);

    let position = EMPTY_POSITION;
    let visible = false;

    if (playerState) {
        const { worldId, row, col } = playerState.cellPosition;
        const cellPlayers = Array.from(playerStates.entries())
            .filter(([, state]) => {
                const cell = state.cellPosition;
                return cell.worldId === worldId && cell.row === row && cell.col === col;
            })
            .sort(([aId, a], [bId, b]) => a.updated - b.updated || aId.localeCompare(bId));
        const index = cellPlayers.findIndex(([id]) => id === playerId);

        position = {
            x: cellWidth * col,
            y: -(cellHeight * row) - cellHeight,
            offsetX: 50 + 100 * (index % CELL_MAX_PLAYERS_LINE),
            offsetY: 130 + 100 * Math.floor(index / CELL_MAX_PLAYERS_LINE),
        };
        visible = cellPlayers.length <= CELL_MAX_PLAYERS;
    }

    const move = (pos: CellPosition) => {
        setPlayerState({
            cellPosition: pos,
            updated: Math.max(Date.now(), getPlayerState()?.updated ?? 0),
        });
    };

    const scrollToPlayer = () => {
        playerRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
    };

    useEffect(() => {
        const saved = getPlayerState();
        const updated = playerProgress.updated ?? 0;
        if (saved && saved.updated >= updated) return;
        if (moving || paths || (useRollDiceStore.getState().isRolling && isCurrentPlayer)) return;

        const world = worldsById.get(playerProgress.currentWorld);
        if (!world?.cellsCount) return;

        const cellPosition = BoardHelper.getCoords(world, playerProgress.cellsPassed);
        setPlayerState({ cellPosition, updated });
    }, [
        playerProgress.currentWorld,
        playerProgress.cellsPassed,
        playerProgress.updated,
        worldsById,
        moving,
        paths,
        isCurrentPlayer,
        getPlayerState,
        setPlayerState,
    ]);

    useEffect(() => {
        const abortController = new AbortController();
        document.addEventListener(`player.scroll.${playerId}`, scrollToPlayer, {
            signal: abortController.signal,
        });
        return () => {
            abortController.abort();
        };
    }, [scrollToPlayer]);

    useEffect(() => {
        if (!paths || isMovingRef.current) return;

        setMoving(true);
        isMovingRef.current = true;

        let cleaned = false;
        let bodyLocked = false;
        let prevBodyOverflow = '';
        let scrollInterval: number | null = null;
        let moveTimeout: number | null = null;

        const stopAnimation = () => {
            if (moveTimeout !== null) clearTimeout(moveTimeout);
            moveTimeout = null;

            if (scrollInterval !== null) clearInterval(scrollInterval);
            scrollInterval = null;

            if (bodyLocked) {
                document.body.style.overflow = prevBodyOverflow;
                bodyLocked = false;
                decrementBlocked();
            }
        };

        const finishMovement = () => {
            if (cleaned) return;
            cleaned = true;
            startedMovementRef.current = false;
            nextStepAtRef.current = null;

            stopAnimation();
            setMoving(false);
            clearMoveTime();
            isMovingRef.current = false;
        };

        if (isCurrentPlayer) {
            if ('scrollLock' in document.body.dataset) {
                prevBodyOverflow = '';
            } else {
                prevBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            }
            bodyLocked = true;
            scrollInterval = window.setInterval(scrollToPlayer, SCROLL_INTERVAL);
            incrementBlocked();
        }

        const scheduleNextStep = (delayMs: number) => {
            moveTimeout = window.setTimeout(() => {
                moveTimeout = null;
                performStep();
            }, delayMs);
        };

        const performStep = () => {
            const next = pullPath();

            if (next) {
                startedMovementRef.current = true;
                nextStepAtRef.current = Date.now() + moveTime * 1000;
                move(next);
                scheduleNextStep(moveTime * 1000);
            } else {
                finishMovement();
            }
        };

        const nextStepAt = nextStepAtRef.current;
        const isRestart = startedMovementRef.current && nextStepAt !== null;

        if (isRestart) {
            scheduleNextStep(Math.max(nextStepAt - Date.now(), 0));
        } else {
            performStep();
        }

        return () => {
            stopAnimation();
            isMovingRef.current = false;
        };
    }, [paths, moveTime, isCurrentPlayer, scrollToPlayer, move, pullPath]);

    return { position, moving, moveTime, visible };
};
