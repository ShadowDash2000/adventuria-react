import { createContext, useContext } from 'react';
import { BoardContextType, BoardInnerContextType } from './types';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { CellRecord } from '@shared/types/cell';

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

export const BoardInnerContext = createContext<BoardInnerContextType>({} as BoardInnerContextType);

export const useBoardInnerContext: () => BoardInnerContextType = () =>
    useContext(BoardInnerContext);

export const useBoardDataContext = () => useContext(BoardDataContext);

export const BoardDataContext = createContext({
    players: [] as PlayerRecord[],
    playersProgress: [] as PlayerProgressRecord[],
    cells: [] as CellRecord[],
});
