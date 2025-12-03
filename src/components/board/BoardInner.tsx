import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Players } from './Players';
import type { CellRecord } from '@shared/types/cell';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { Cells } from './Cells';
import type { RecordIdString } from '@shared/types/pocketbase';
import { BoardHelper } from './BoardHelper';
import { useBoardDataContext } from './BoardDataContext';
import { useBoardContext } from './Board';

type BoardInnerContextType = {
    cells: CellRecord[];
    cellsOrdered: CellRecord[][];
    cellsOrderedRev: CellRecord[][];
    cellsUsers: Map<RecordIdString, RecordIdString[]>;
    users: Map<RecordIdString, UserRecord>;
    boardDimensions: Dimension;
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
    cellsUsersRebuild: () => void;
};

type Dimension = { width: number; height: number };

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const BoardInner = () => {
    const { pb, isAuth, user } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const { users: usersRaw, cells: cellRaw } = useBoardDataContext();

    const [cells, setCells] = useState<CellRecord[]>(cellRaw);
    const [users, setUsers] = useState<Map<RecordIdString, UserRecord>>(
        new Map(usersRaw.map(u => [u.id, u])),
    );

    const cellsOrdered = useMemo(() => BoardHelper.buildCells(cells), [cells]);
    const cellsOrderedRev = useMemo(() => cellsOrdered.slice().reverse(), [cellsOrdered]);
    const [cellsUsersRef, setCellsUsersRef] = useState({});
    const cellsUsers = useMemo(() => {
        return BoardHelper.buildCellsUsers([...users.values()], cells);
    }, [users, cells, cellsUsersRef]);

    const cellsUsersRebuild = useCallback(() => {
        setCellsUsersRef({});
    }, []);

    // board geometry
    const [boardDimensions, setBoardDimensions] = useState<Dimension>({ width: 0, height: 0 });

    // derived grid size
    const rows = cellsOrdered.length;
    const cols = rows > 0 ? cellsOrdered[0].length : 0;

    // derived cell size in px based on container size
    const { width: cellWidth, height: cellHeight } = useMemo((): Dimension => {
        const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
        const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;
        return { width: cellWidth, height: cellHeight };
    }, [boardDimensions.width, boardDimensions.height, rows, cols]);

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
                        if (e.record.id !== user!.id) {
                            document.dispatchEvent(
                                new CustomEvent(`player.move.${e.record.id}`, {
                                    detail: {
                                        prevCellsPassed: prev.get(e.record.id)!.cellsPassed,
                                        cellsPassed: e.record.cellsPassed,
                                    },
                                }),
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
                cells,
                cellsOrdered,
                cellsOrderedRev,
                cellsUsers,
                users,
                boardDimensions,
                rows,
                cols,
                cellWidth,
                cellHeight,
                cellsUsersRebuild,
            }}
        >
            <Cells />
            <Players />
        </BoardInnerContext.Provider>
    );
};

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);
