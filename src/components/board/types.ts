import type { RefObject } from 'react';
import type { WorldBoard } from '@components/board/BoardHelper';
import { ActivePlayer } from '@shared/query/requests';

export type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

export type BoardInnerContextType = {
    activePlayers: ActivePlayer[];
    worldsById: Map<string, WorldBoard>;
    cellWidth: number;
    cellHeight: number;
};
