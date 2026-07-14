import type { RefObject } from 'react';
import type { BoardTopology, CellBoard } from '@components/board/BoardHelper';
import type { PlayerRecord } from '@shared/types/player';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

export type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

export type BoardInnerContextType = {
    cellsOrdered: CellBoard[][];
    cellsOrderedRev: CellBoard[][];
    topology: BoardTopology;
    defaultWorldId?: string;
    defaultWorldSlug?: string;
    worldSizesById: Map<string, { rows: number; cols: number; cellsCount: number }>;
    playersByCellIndex: Map<number, PlayerRecord[]>;
    players: Map<RecordIdString, PlayerRecord>;
    playersProgress: Map<RecordIdString, PlayerProgressRecord>;
    cellWidth: number;
    cellHeight: number;
};
