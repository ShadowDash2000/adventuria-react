import { createContext, useContext } from 'react';
import { BoardContextType, BoardInnerContextType } from './types';
import type { UserRecord } from '@shared/types/user';
import type { CellRecord } from '@shared/types/cell';

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);

export const useBoardDataContext = () => useContext(BoardDataContext);

export const BoardDataContext = createContext({
    users: [] as UserRecord[],
    cells: [] as CellRecord[],
});
