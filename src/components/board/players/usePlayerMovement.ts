import { type RefObject, useCallback, useEffect, useRef, useState } from 'react';
import { useBoardInnerContext } from '../BoardInner';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { BoardHelper, type CellPosition } from '../BoardHelper';
import type { UserRecord } from '@shared/types/user';
import { CELL_MAX_USERS, CELL_MAX_USERS_LINE } from '../Board';

type PlayerPosition = { x: number; y: number; offsetX: number; offsetY: number };

export type PlayerMoveEvent = { prevCellsPassed: number; cellsPassed: number; pathTime?: number };

const MOVE_TIME_DEFAULT = 1;

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

export const usePlayerMovement = ({
    user,
    playerRef,
}: PlayerMovementProps): PlayerMovementReturn => {
    const { isAuth, user: userAuth } = useAppContext();
    const { rows, cols, cellWidth, cellHeight, cellsOrdered, cellsUsers, cellsUsersRebuild } =
        useBoardInnerContext();
    const [position, setPosition] = useState<PlayerPosition>({
        offsetX: 0,
        offsetY: 0,
        x: 0,
        y: 0,
    });
    const isCurrentUser = user.id === userAuth.id;
    const [moving, setMoving] = useState<boolean>(false);
    const [moveTime, setMoveTime] = useState<number>(MOVE_TIME_DEFAULT);
    const [visible, setVisible] = useState<boolean>(true);

    const stepsQueue = useRef<CellPosition[]>([]);
    const [moveIntervalId, setMoveIntervalId] = useState<number | null>(null);
    const [scrollIntervalId, setScrollIntervalId] = useState<number | null>(null);

    const [movementTick, setMovementTick] = useState<number>(0);

    const move = useCallback(
        (row: number, col: number) => {
            const cell = cellsOrdered[row][col];
            let userCol = 0;
            let userRow = 0;
            if (cell) {
                const cellUsers = cellsUsers.get(cell.id);
                if (cellUsers) {
                    const index = cellUsers.findIndex(value => value === user.id);
                    if (index !== -1) {
                        userCol = index % CELL_MAX_USERS_LINE;
                        userRow = Math.floor(index / CELL_MAX_USERS_LINE);
                    }

                    setVisible(cellUsers.length <= CELL_MAX_USERS);
                } else {
                    setVisible(true);
                }
            }
            const x = cellWidth * col;
            const y = -(cellHeight * row) - cellHeight;
            const offsetX = 50 + 100 * userCol;
            const offsetY = 130 + 100 * userRow;

            setPosition({ x, y, offsetX, offsetY });
        },
        [cellWidth, cellHeight, cellsOrdered, cellsUsers],
    );

    // sets the initial position
    useEffect(() => {
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);
    }, [rows, cols, cellWidth, cellHeight]);

    const scrollToUser = useCallback(() => {
        playerRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
    }, [playerRef]);

    const startMovingInterval = useCallback(
        (stepTimeSec: number, blockScroll: boolean): void => {
            if (moveIntervalId) return;

            setMoveTime(stepTimeSec);
            setMoving(true);
            setMovementTick(prev => prev + 1);
            setMoveIntervalId(
                setInterval(() => {
                    setMovementTick(prev => prev + 1);
                }, stepTimeSec * 1000),
            );

            if (blockScroll) {
                setScrollIntervalId(setInterval(scrollToUser, 100));
                document.body.style.overflow = 'hidden';
            }
        },
        [moveIntervalId],
    );

    useEffect(() => {
        if (!moveIntervalId) return;

        const next = stepsQueue.current.shift();

        if (next) {
            move(next.row, next.col);
            return;
        }

        setMoving(false);
        setMovementTick(0);
        if (moveIntervalId) {
            clearInterval(moveIntervalId);
            setMoveIntervalId(null);
            setMoveTime(MOVE_TIME_DEFAULT);
        }
        if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            setScrollIntervalId(null);
            document.body.style.overflow = 'auto';
        }
        cellsUsersRebuild();
    }, [movementTick, moveIntervalId, scrollIntervalId]);

    useEffect(() => {
        if (!isAuth) return;

        const abortController = new AbortController();

        document.addEventListener(
            `player.move.${user.id}`,
            e => {
                const { detail } = e as CustomEvent<PlayerMoveEvent>;

                const newPath: CellPosition[] = [];
                if (stepsQueue.current.length > 0) {
                    newPath.push(BoardHelper.getCoords(rows, cols, detail.cellsPassed));
                } else {
                    newPath.push(
                        ...BoardHelper.createPath(
                            rows,
                            cols,
                            detail.prevCellsPassed,
                            detail.cellsPassed,
                        ),
                    );
                }

                stepsQueue.current = [...stepsQueue.current, ...newPath];

                let stepTime = MOVE_TIME_DEFAULT;
                if (detail.pathTime) {
                    stepTime = detail.pathTime / newPath.length;
                }

                startMovingInterval(stepTime, isCurrentUser);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [rows, cols, isAuth, startMovingInterval]);

    useEffect(() => {
        if (!isAuth) return;

        const abortController = new AbortController();

        document.addEventListener(
            'player.update',
            () => {
                if (moving) return;
                const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
                move(pos.row, pos.col);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [rows, cols, moving, user.cellsPassed, move]);

    useEffect(() => {
        const abortController = new AbortController();
        document.addEventListener(
            `player.scroll.${user.id}`,
            () => {
                scrollToUser();
            },
            { signal: abortController.signal },
        );
        return () => {
            abortController.abort();
        };
    }, [scrollToUser]);

    return { position, moving, moveTime, visible };
};
