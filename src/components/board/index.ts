import { createContext, useContext } from 'react';
import { BoardContextType, BoardInnerContextType } from './types';
import type { CellRecord } from '@shared/types/cell';
import type { WorldRecord } from '@shared/types/world';
import type { ActiveActor } from '@shared/query/requests';

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);

export const useBoardDataContext = () => useContext(BoardDataContext);

export const BoardDataContext = createContext({
    activeActors: [] as ActiveActor[],
    cells: [] as CellRecord[],
    worlds: [] as WorldRecord[],
});
