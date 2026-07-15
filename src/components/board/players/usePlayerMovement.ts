import { type RefObject, useEffect, useRef, useState } from 'react';
import { useBoardInnerContext } from '@components/board';
import { useAppContext } from '@context/AppContext';
import { BoardHelper } from '../BoardHelper';
import { CELL_MAX_PLAYERS, CELL_MAX_PLAYERS_LINE } from '../Board';
import { usePlayer } from '@components/board/players/usePlayer';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';
import { invalidatePlayerProgress, invalidatePlayers } from '@shared/queryClient';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

type PlayerPosition = { x: number; y: number; offsetX: number; offsetY: number };

interface PlayerMovementProps {
    playerProgress: PlayerProgressRecord;
    playerRef: RefObject<HTMLElement | null>;
}

interface PlayerMovementReturn {
    position: PlayerPosition;
    moving: boolean;
    moveTime: number;
    visible: boolean;
}

const SCROLL_INTERVAL = 50;

export const usePlayerMovement = ({
    playerProgress,
    playerRef,
}: PlayerMovementProps): PlayerMovementReturn => {
    const { player: playerAuth } = useAppContext();
    const { cellWidth, cellHeight, cellsOrdered, worldsById } = useBoardInnerContext();
    const isCurrentPlayer = playerAuth ? playerProgress.player === playerAuth.id : false;
    const [moving, setMoving] = useState<boolean>(false);
    const { incrementBlocked, decrementBlocked } = useKbdSettings(KbdKey.inventory);

    const { pullPath, paths, moveTime, clearMoveTime } = usePlayer(playerProgress.player);

    const isMovingRef = useRef(false);
    const startedMovementRef = useRef(false);
    const nextStepAtRef = useRef<number | null>(null);

    const calculateState = (
        row: number,
        col: number,
    ): { position: PlayerPosition; visible: boolean } => {
        const cell = cellsOrdered[row][col];
        let playerCol = 0;
        let playerRow = 0;
        let isVisible = true;

        if (cell && cell.players) {
            const index = cell.players.findIndex(player => player.id === playerProgress.player);
            if (index !== -1) {
                playerCol = index % CELL_MAX_PLAYERS_LINE;
                playerRow = Math.floor(index / CELL_MAX_PLAYERS_LINE);
            }
            isVisible = cell.players.length <= CELL_MAX_PLAYERS;
        }

        const x = cellWidth * col;
        const y = -(cellHeight * row) - cellHeight;
        const offsetX = 50 + 100 * playerCol;
        const offsetY = 130 + 100 * playerRow;

        return { position: { x, y, offsetX, offsetY }, visible: isVisible };
    };

    const [initialState] = useState(() => {
        const worldId = playerProgress.current_world;
        const world = worldsById.get(worldId);
        if (!world?.cellsCount) {
            return { position: { x: 0, y: 0, offsetX: 0, offsetY: 0 }, visible: false };
        }
        const pos = BoardHelper.getCoords(world, playerProgress.cells_passed);
        return calculateState(pos.row, pos.col);
    });

    const [position, setPosition] = useState<PlayerPosition>(initialState.position);
    const [visible, setVisible] = useState<boolean>(initialState.visible);

    const move = (row: number, col: number) => {
        const newState = calculateState(row, col);
        setPosition(newState.position);
        setVisible(newState.visible);
    };

    const scrollToPlayer = () => {
        playerRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
    };

    useEffect(() => {
        if (moving || paths || (useRollDiceStore.getState().isRolling && isCurrentPlayer)) return;

        const worldId = playerProgress.current_world;
        const world = worldsById.get(worldId);
        if (!world?.cellsCount) {
            setVisible(false);
            return;
        } else {
            const pos = BoardHelper.getCoords(world, playerProgress.cells_passed);
            if (!pos) {
                setVisible(false);
                return;
            }

            move(pos.row, pos.col);
        }
    }, [moving, paths, cellWidth, cellHeight, cellsOrdered]);

    useEffect(() => {
        const abortController = new AbortController();
        document.addEventListener(`player.scroll.${playerProgress.player}`, scrollToPlayer, {
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

            void invalidatePlayerProgress(playerProgress.player);
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
                move(next.row, next.col);
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
