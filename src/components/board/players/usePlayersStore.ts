import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellPosition } from '@components/board/BoardHelper';
import { create } from 'zustand/react';

type PlayerStoreState = {
    paths: Map<RecordIdString, CellPosition[]>;
    moveTimes: Map<RecordIdString, number>;
    addPaths: (userId: RecordIdString, paths: CellPosition[]) => void;
    getPaths: (userId: RecordIdString) => CellPosition[] | null;
    pullPath: (userId: RecordIdString) => CellPosition | null;
    setMoveTime: (userId: RecordIdString, time: number) => void;
    getMoveTime: (userId: RecordIdString) => number | null;
    clearMoveTime: (userId: RecordIdString) => void;
};

export const usePlayersStore = create<PlayerStoreState>((set, get) => ({
    paths: new Map<RecordIdString, CellPosition[]>(),
    moveTimes: new Map<RecordIdString, number>(),

    addPaths: (userId, paths) => {
        const prevPaths = get().paths.get(userId) || [];
        set(state => ({ paths: state.paths.set(userId, [...prevPaths, ...paths]) }));
    },

    getPaths: userId => {
        const paths = get().paths;
        return paths.get(userId) || null;
    },

    pullPath: (userId: RecordIdString) => {
        const paths = get().getPaths(userId);
        if (!paths) return null;
        const path = paths.shift();
        if (!path) {
            set(state => {
                const newPaths = new Map(state.paths);
                newPaths.delete(userId);
                return { paths: newPaths };
            });
            return null;
        }
        set(state => ({ paths: state.paths.set(userId, paths) }));
        return path;
    },

    setMoveTime: (userId: RecordIdString, time: number) => {
        set(state => ({ moveTimes: state.moveTimes.set(userId, time) }));
    },

    getMoveTime: (userId: RecordIdString) => {
        return get().moveTimes.get(userId) || null;
    },

    clearMoveTime: (userId: RecordIdString) => {
        set(state => {
            const newMoveTimes = new Map(state.moveTimes);
            newMoveTimes.delete(userId);
            return { moveTimes: newMoveTimes };
        });
    },
}));
