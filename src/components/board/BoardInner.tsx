import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Players } from './players/Players';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContextProvider';
import { Cells } from './cells/Cells';
import type { RecordIdString } from '@shared/types/pocketbase';
import { BoardHelper, type CellBoard } from './BoardHelper';
import { useBoardDataContext } from './BoardDataContext';
import { useBoardContext } from './Board';
import { CellsPlayers } from './cells/CellsPlayers';
import { UserActionMenu } from '@components/UserActionMenu';
import { usePlayersStore } from '@components/board/players/usePlayersStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';

type BoardInnerContextType = {
    cellsOrdered: CellBoard[][];
    cellsOrderedRev: CellBoard[][];
    usersByCellIndex: Map<number, UserRecord[]>;
    users: Map<RecordIdString, UserRecord>;
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
};

type Dimension = { width: number; height: number };

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const BoardInner = () => {
    const { pb, isAuth, user } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const { users: usersRaw, cells } = useBoardDataContext();
    const [users, setUsers] = useState<Map<RecordIdString, UserRecord>>(
        new Map(usersRaw.map(u => [u.id, u])),
    );

    const cellsOrdered = BoardHelper.buildCells(cells, users);
    const cellsOrderedRev = cellsOrdered.lines.slice().reverse();

    // board geometry
    const [boardDimensions, setBoardDimensions] = useState<Dimension>({ width: 0, height: 0 });

    // derived grid size
    const rows = cellsOrdered.lines.length;
    const cols = rows > 0 ? cellsOrdered.lines[0].length : 0;

    // derived cell size in px based on container size
    const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;

    // observe board container size and update boardWidth/boardHeight
    useEffect(() => {
        const board = boardInnerRef.current;
        if (!board) return;

        const measure = () => {
            const rect = board.getBoundingClientRect();
            setBoardDimensions({ width: rect.width, height: rect.height });
        };

        // initial measure
        measure();

        const ro = new ResizeObserver(() => {
            measure();
        });
        ro.observe(board);

        return () => {
            ro.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isAuth) return;

        pb.collection('users').subscribe<UserRecord>('*', e => {
            switch (e.action) {
                case 'create':
                    setUsers(prev => {
                        const next = new Map(prev);
                        next.set(e.record.id, e.record);
                        return next;
                    });
                    break;
                case 'update':
                    setUsers(prev => {
                        if (!(e.record.id === user.id && useRollDiceStore.getState().isRolling)) {
                            usePlayersStore
                                .getState()
                                .addPaths(
                                    e.record.id,
                                    BoardHelper.createPath(
                                        rows,
                                        cols,
                                        prev.get(e.record.id)!.cellsPassed,
                                        e.record.cellsPassed,
                                    ),
                                );
                        }

                        const next = new Map(prev);
                        next.set(e.record.id, e.record);
                        return next;
                    });
                    break;
                case 'delete':
                    setUsers(prev => {
                        const next = new Map(prev);
                        next.delete(e.record.id);
                        return next;
                    });
                    break;
            }
        });

        return () => {
            pb.collection('users').unsubscribe();
        };
    }, [pb, isAuth]);

    return (
        <BoardInnerContext.Provider
            value={{
                cellsOrdered: cellsOrdered.lines,
                usersByCellIndex: cellsOrdered.usersByCellIndex,
                cellsOrderedRev,
                users,
                rows,
                cols,
                cellWidth,
                cellHeight,
            }}
        >
            <Cells />
            {cellWidth !== 0 && cellHeight !== 0 && <Players />}
            <CellsPlayers />
            {isAuth ? <UserActionMenu /> : null}
        </BoardInnerContext.Provider>
    );
};

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);
