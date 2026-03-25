import { type RefObject, useEffect, useRef, useState } from 'react';
import { useBoardInnerContext } from '@components/board';
import { useAppContext } from '@context/AppContext';
import { BoardHelper } from '../BoardHelper';
import type { UserRecord } from '@shared/types/user';
import { CELL_MAX_USERS, CELL_MAX_USERS_LINE } from '../Board';
import { usePlayer } from '@components/board/players/usePlayer';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';
import { invalidateUsers } from '@shared/queryClient';

type PlayerPosition = { x: number; y: number; offsetX: number; offsetY: number };

interface PlayerMovementProps {
    user: UserRecord;
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
    user,
    playerRef,
}: PlayerMovementProps): PlayerMovementReturn => {
    const { user: userAuth } = useAppContext();
    const { rows, cols, cellWidth, cellHeight, cellsOrdered } = useBoardInnerContext();
    const isCurrentUser = userAuth ? user.id === userAuth.id : false;
    const [moving, setMoving] = useState<boolean>(false);
    const { incrementBlocked, decrementBlocked } = useKbdSettings(KbdKey.inventory);

    const { pullPath, paths, moveTime, clearMoveTime } = usePlayer(user.id);

    const isMovingRef = useRef(false);
    const startedMovementRef = useRef(false);
    const nextStepAtRef = useRef<number | null>(null);

    const calculateState = (
        row: number,
        col: number,
    ): { position: PlayerPosition; visible: boolean } => {
        const cell = cellsOrdered[row][col];
        let userCol = 0;
        let userRow = 0;
        let isVisible = true;

        if (cell && cell.players) {
            const index = cell.players.findIndex(player => player.id === user.id);
            if (index !== -1) {
                userCol = index % CELL_MAX_USERS_LINE;
                userRow = Math.floor(index / CELL_MAX_USERS_LINE);
            }
            isVisible = cell.players.length <= CELL_MAX_USERS;
        }

        const x = cellWidth * col;
        const y = -(cellHeight * row) - cellHeight;
        const offsetX = 50 + 100 * userCol;
        const offsetY = 130 + 100 * userRow;

        return { position: { x, y, offsetX, offsetY }, visible: isVisible };
    };

    const [initialState] = useState(() => {
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        return calculateState(pos.row, pos.col);
    });

    const [position, setPosition] = useState<PlayerPosition>(initialState.position);
    const [visible, setVisible] = useState<boolean>(initialState.visible);

    const move = (row: number, col: number) => {
        const newState = calculateState(row, col);
        setPosition(newState.position);
        setVisible(newState.visible);
    };

    const scrollToUser = () => {
        playerRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
    };

    useEffect(() => {
        if (moving || paths || (useRollDiceStore.getState().isRolling && isCurrentUser)) return;
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);
    }, [cellWidth, cellHeight, cellsOrdered]);

    useEffect(() => {
        const abortController = new AbortController();
        document.addEventListener(`player.scroll.${user.id}`, scrollToUser, {
            signal: abortController.signal,
        });
        return () => {
            abortController.abort();
        };
    }, [scrollToUser]);

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

            void invalidateUsers();
        };

        if (isCurrentUser) {
            if ('scrollLock' in document.body.dataset) {
                prevBodyOverflow = '';
            } else {
                prevBodyOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
            }
            bodyLocked = true;
            scrollInterval = window.setInterval(scrollToUser, SCROLL_INTERVAL);
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
    }, [paths, moveTime, isCurrentUser, scrollToUser, move, pullPath]);

    return { position, moving, moveTime, visible };
};
