import type { RefObject } from 'react';
import type { CellBoard } from '@components/board/BoardHelper';
import type { UserRecord } from '@shared/types/user';
import type { RecordIdString } from '@shared/types/pocketbase';

export type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

export type BoardInnerContextType = {
    cellsOrdered: CellBoard[][];
    cellsOrderedRev: CellBoard[][];
    usersByCellIndex: Map<number, UserRecord[]>;
    users: Map<RecordIdString, UserRecord>;
    rows: number;
    cols: number;
    cellWidth: number;
    cellHeight: number;
};
