import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellPosition } from '@components/board/BoardHelper';
import { create } from 'zustand/react';

type PlayerStoreState = {
    paths: Map<RecordIdString, CellPosition[]>;
    moveTimes: Map<RecordIdString, number>;
    addPaths: (playerId: RecordIdString, paths: CellPosition[]) => void;
    getPaths: (playerId: RecordIdString) => CellPosition[] | null;
    pullPath: (playerId: RecordIdString) => CellPosition | null;
    setMoveTime: (playerId: RecordIdString, time: number) => void;
    getMoveTime: (playerId: RecordIdString) => number | null;
    clearMoveTime: (playerId: RecordIdString) => void;
};

export const usePlayersStore = create<PlayerStoreState>((set, get) => ({
    paths: new Map<RecordIdString, CellPosition[]>(),
    moveTimes: new Map<RecordIdString, number>(),

    addPaths: (playerId, paths) => {
        const prevPaths = get().paths.get(playerId) || [];
        set(state => ({ paths: state.paths.set(playerId, [...prevPaths, ...paths]) }));
    },

    getPaths: playerId => {
        const paths = get().paths;
        return paths.get(playerId) || null;
    },

    pullPath: (playerId: RecordIdString) => {
        const paths = get().getPaths(playerId);
        if (!paths) return null;
        const path = paths.shift();
        if (!path) {
            set(state => {
                const newPaths = new Map(state.paths);
                newPaths.delete(playerId);
                return { paths: newPaths };
            });
            return null;
        }
        set(state => ({ paths: state.paths.set(playerId, paths) }));
        return path;
    },

    setMoveTime: (playerId: RecordIdString, time: number) => {
        set(state => ({ moveTimes: state.moveTimes.set(playerId, time) }));
    },

    getMoveTime: (playerId: RecordIdString) => {
        return get().moveTimes.get(playerId) || null;
    },

    clearMoveTime: (playerId: RecordIdString) => {
        set(state => {
            const newMoveTimes = new Map(state.moveTimes);
            newMoveTimes.delete(playerId);
            return { moveTimes: newMoveTimes };
        });
    },
}));
