import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellPosition } from '@components/board/BoardHelper';
import { create } from 'zustand/react';

export type ActorPosition = { x: number; y: number; offsetX: number; offsetY: number };

export type ActorMovementState = { cellPosition: CellPosition; updated: number };

type ActorStoreState = {
    actorStates: Map<RecordIdString, ActorMovementState>;
    paths: Map<RecordIdString, CellPosition[]>;
    moveTimes: Map<RecordIdString, number>;
    setActorState: (actorId: RecordIdString, actorState: ActorMovementState) => void;
    getActorState: (actorId: RecordIdString) => ActorMovementState | null;
    updateActorState: (actorId: RecordIdString, patch: Partial<ActorMovementState>) => void;
    clearActorState: (actorId: RecordIdString) => void;
    addPaths: (actorId: RecordIdString, paths: CellPosition[]) => void;
    getPaths: (actorId: RecordIdString) => CellPosition[] | null;
    pullPath: (actorId: RecordIdString) => CellPosition | null;
    setMoveTime: (actorId: RecordIdString, time: number) => void;
    getMoveTime: (actorId: RecordIdString) => number | null;
    clearMoveTime: (actorId: RecordIdString) => void;
};

export const useActorsStore = create<ActorStoreState>((set, get) => ({
    actorStates: new Map<RecordIdString, ActorMovementState>(),
    paths: new Map<RecordIdString, CellPosition[]>(),
    moveTimes: new Map<RecordIdString, number>(),

    setActorState: (actorId, actorState) => {
        set(state => ({ actorStates: new Map(state.actorStates).set(actorId, actorState) }));
    },

    getActorState: actorId => get().actorStates.get(actorId) ?? null,

    updateActorState: (actorId, patch) => {
        set(state => {
            const previous = state.actorStates.get(actorId);
            if (!previous) return state;

            return {
                actorStates: new Map(state.actorStates).set(actorId, { ...previous, ...patch }),
            };
        });
    },

    clearActorState: actorId => {
        set(state => {
            if (!state.actorStates.has(actorId)) return state;

            const actorState = new Map(state.actorStates);
            actorState.delete(actorId);
            return { actorStates: actorState };
        });
    },

    addPaths: (actorId, paths) => {
        const prevPaths = get().paths.get(actorId) || [];
        set(state => ({ paths: state.paths.set(actorId, [...prevPaths, ...paths]) }));
    },

    getPaths: actorId => {
        const paths = get().paths;
        return paths.get(actorId) || null;
    },

    pullPath: (actorId: RecordIdString) => {
        const paths = get().getPaths(actorId);
        if (!paths) return null;
        const path = paths.shift();
        if (!path) {
            set(state => {
                const newPaths = new Map(state.paths);
                newPaths.delete(actorId);
                return { paths: newPaths };
            });
            return null;
        }
        set(state => ({ paths: state.paths.set(actorId, paths) }));
        return path;
    },

    setMoveTime: (actorId: RecordIdString, time: number) => {
        set(state => ({ moveTimes: state.moveTimes.set(actorId, time) }));
    },

    getMoveTime: (actorId: RecordIdString) => {
        return get().moveTimes.get(actorId) || null;
    },

    clearMoveTime: (actorId: RecordIdString) => {
        set(state => {
            const newMoveTimes = new Map(state.moveTimes);
            newMoveTimes.delete(actorId);
            return { moveTimes: newMoveTimes };
        });
    },
}));
