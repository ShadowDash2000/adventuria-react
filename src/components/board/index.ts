import { createContext, useContext } from 'react';
import { BoardContextType, BoardInnerContextType } from './types';
import type { ActiveActor } from '@shared/query/requests';
import type { CellBoard, WorldBoard } from '@shared/query/requests/cells-board';

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);

export const useBoardDataContext = () => useContext(BoardDataContext);

export const BoardDataContext = createContext({
    activeActors: [] as ActiveActor[],
    cells: [] as CellBoard[],
    worlds: [] as WorldBoard[],
});
