import type { RefObject } from 'react';
import type { WorldBoard } from '@components/board/BoardHelper';
import type { ActiveActor } from '@shared/query/requests';

export type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

export type BoardInnerContextType = {
    activeActors: ActiveActor[];
    worldsById: Map<string, WorldBoard>;
    cellWidth: number;
    cellHeight: number;
};
