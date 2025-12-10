import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { useBoardInnerContext } from './BoardInner';
import { BoardHelper } from './BoardHelper';
import { Avatar } from '../Avatar';
import { type AvatarRootProps } from '@chakra-ui/react/avatar';

interface PlayerProps extends AvatarRootProps {
    user: UserRecord;
}

type PlayerPosition = { x: number; y: number; offsetX: number; offsetY: number };

export type PlayerMoveEvent = { prevCellsPassed: number; cellsPassed: number; pathTime?: number };

const CELL_MAX_USERS_LINE = 3;
const MOVE_TIME_DEFAULT = 1;
const CELL_MAX_USERS = 6;

export const Player: FC<PlayerProps> = ({ user, ...rest }) => {
    const { isAuth, user: userAuth } = useAppContext();
    const { rows, cols, cellWidth, cellHeight, cellsOrdered, cellsUsers, cellsUsersRebuild } =
        useBoardInnerContext();
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const [position, setPosition] = useState<PlayerPosition>({
        offsetX: 0,
        offsetY: 0,
        x: 0,
        y: 0,
    });
    const isCurrentUser = useMemo(() => user.id === userAuth.id, [user.id, userAuth.id]);
    const [moving, setMoving] = useState<boolean>(false);
    const [moveTime, setMoveTime] = useState<number>(MOVE_TIME_DEFAULT);
    const [visible, setVisible] = useState<boolean>(true);

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

    const scrollToUser = useCallback(() => {
        avatarRef.current?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'center',
        });
    }, [avatarRef]);

    // sets the initial position on the first render
    useEffect(() => {
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);
    }, [rows, cols, cellWidth, cellHeight]);

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

    useEffect(() => {
        if (!isAuth) return;

        const abortController = new AbortController();
        const stepsQueue: Array<{ row: number; col: number }> = [];
        let moveIntervalId: number | null = null;
        let scrollIntervalId: number | null = null;
        document.addEventListener(
            `player.move.${user.id}`,
            e => {
                const { detail } = e as CustomEvent<PlayerMoveEvent>;

                if (stepsQueue.length > 0) {
                    stepsQueue.push(BoardHelper.getCoords(rows, cols, detail.cellsPassed));
                } else {
                    stepsQueue.push(
                        ...BoardHelper.createPath(
                            rows,
                            cols,
                            detail.prevCellsPassed,
                            detail.cellsPassed,
                        ),
                    );
                }

                if (moveIntervalId) return;

                let stepTime = MOVE_TIME_DEFAULT;
                if (detail.pathTime) {
                    stepTime = detail.pathTime / stepsQueue.length;
                    setMoveTime(stepTime);
                }

                setMoving(true);
                startInterval(stepTime, isCurrentUser).then(() => {
                    setMoving(false);
                    clearMovement();
                    cellsUsersRebuild();
                });
            },
            { signal: abortController.signal },
        );

        const startInterval = (stepTimeSec: number, blockScroll: boolean): Promise<void> => {
            return new Promise(resolve => {
                moveInterval();
                moveIntervalId = setInterval(() => {
                    if (!moveInterval()) return resolve();
                }, stepTimeSec * 1000);

                if (blockScroll) {
                    scrollIntervalId = setInterval(scrollToUser, 100);
                    document.body.style.overflow = 'hidden';
                }
            });
        };

        const moveInterval = (): boolean => {
            const next = stepsQueue.shift();

            if (!next) {
                return false;
            }

            move(next.row, next.col);
            return true;
        };

        const clearMovement = () => {
            if (moveIntervalId) {
                clearInterval(moveIntervalId);
                moveIntervalId = null;
                setMoveTime(MOVE_TIME_DEFAULT);
            }
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
                scrollIntervalId = null;
                document.body.style.overflow = 'auto';
            }
        };

        return () => {
            abortController.abort();
            clearMovement();
        };
    }, [rows, cols, cellWidth, cellHeight, isAuth]);

    useEffect(() => {
        if (!isAuth || isCurrentUser) return;

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
    }, [rows, cols, user.cellsPassed, move]);

    return (
        <Avatar
            {...rest}
            ref={avatarRef}
            user={user}
            visibility={visible || moving ? 'visible' : 'hidden'}
            position="absolute"
            transform={`translate(calc(${position.x}px + ${position.offsetX}%), calc(${position.y}px + ${position.offsetY}%))`}
            transition={`transform ${moveTime}s ease`}
        />
    );
};
