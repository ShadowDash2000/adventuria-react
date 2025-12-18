import { type RefObject, useEffect, useRef, useState } from 'react';
import { useBoardInnerContext } from '@components/board';
import { useAppContext } from '@context/AppContext';
import { BoardHelper } from '../BoardHelper';
import type { UserRecord } from '@shared/types/user';
import { CELL_MAX_USERS, CELL_MAX_USERS_LINE } from '../Board';
import { usePlayer } from '@components/board/players/usePlayer';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';

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

    const { pullPath, paths, moveTime, clearMoveTime } = usePlayer(user.id);

    const isMovingRef = useRef(false);

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

        let scrollInterval: number | null = null;
        let moveInterval: number | null = null;

        if (isCurrentUser) {
            document.body.style.overflow = 'hidden';
            scrollInterval = window.setInterval(scrollToUser, SCROLL_INTERVAL);
        }
        const cleanup = () => {
            if (moveInterval !== null) clearInterval(moveInterval);
            if (scrollInterval !== null) {
                clearInterval(scrollInterval);
                document.body.style.overflow = 'auto';
            }
            setMoving(false);
            clearMoveTime();
            isMovingRef.current = false;
        };

        const performStep = () => {
            const next = pullPath();

            if (next) {
                move(next.row, next.col);
            } else {
                cleanup();
            }
        };

        performStep();
        if (isMovingRef.current) {
            moveInterval = window.setInterval(performStep, moveTime * 1000);
        }

        return () => {
            cleanup();
        };
    }, [paths, moveTime, isCurrentUser, scrollToUser, move, pullPath]);

    return { position, moving, moveTime, visible };
};
