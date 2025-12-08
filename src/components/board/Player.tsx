import { FC, useCallback, useEffect, useRef, useState } from 'react';
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

    useEffect(() => {
        if (user.id === userAuth?.id) return;
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);
    }, [rows, cols, cellWidth, cellHeight, cellsUsers]);

    useEffect(() => {
        const abortController = new AbortController();

        document.addEventListener(
            `player.scroll.${user.id}`,
            () => {
                scrollToUser();
            },
            { signal: abortController.signal },
        );

        if (!isAuth) {
            return () => {
                abortController.abort();
            };
        }

        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);

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

                    const avatarEl = avatarRef.current;
                    if (avatarEl) {
                        avatarEl.style.transition = `transform ${stepTime}s ease`;
                    }
                }

                moveInterval();
                moveIntervalId = setInterval(moveInterval, stepTime * 1000);
                scrollIntervalId = setInterval(scrollToUser, 100);
                document.body.style.overflow = 'hidden';
            },
            { signal: abortController.signal },
        );

        const moveInterval = () => {
            const next = stepsQueue.shift();

            if (!next) {
                if (moveIntervalId) {
                    clearInterval(moveIntervalId);
                    moveIntervalId = null;
                    const avatarEl = avatarRef.current;
                    if (avatarEl) {
                        avatarEl.style.transition = '';
                    }
                    cellsUsersRebuild();
                }
                if (scrollIntervalId) {
                    clearInterval(scrollIntervalId);
                    scrollIntervalId = null;
                    document.body.style.overflow = 'auto';
                }
                return;
            }

            move(next.row, next.col);
        };

        return () => {
            abortController.abort();
            if (moveIntervalId) clearInterval(moveIntervalId);
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
                document.body.style.overflow = 'auto';
            }
        };
    }, [rows, cols, cellWidth, cellHeight, isAuth]);

    return (
        <Avatar
            {...rest}
            ref={avatarRef}
            user={user}
            position="absolute"
            transform={`translate(calc(${position.x}px + ${position.offsetX}%), calc(${position.y}px + ${position.offsetY}%))`}
            transition={`transform ${MOVE_TIME_DEFAULT}s ease`}
        />
    );
};
