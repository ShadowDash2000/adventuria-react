import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellPosition } from '@components/board/BoardHelper';
import { create } from 'zustand/react';

export type PlayerPosition = { x: number; y: number; offsetX: number; offsetY: number };

export type PlayerMovementState = { cellPosition: CellPosition; updated: number };

type PlayerStoreState = {
    playerStates: Map<RecordIdString, PlayerMovementState>;
    paths: Map<RecordIdString, CellPosition[]>;
    moveTimes: Map<RecordIdString, number>;
    setPlayerState: (playerId: RecordIdString, playerState: PlayerMovementState) => void;
    getPlayerState: (playerId: RecordIdString) => PlayerMovementState | null;
    updatePlayerState: (playerId: RecordIdString, patch: Partial<PlayerMovementState>) => void;
    clearPlayerState: (playerId: RecordIdString) => void;
    addPaths: (playerId: RecordIdString, paths: CellPosition[]) => void;
    getPaths: (playerId: RecordIdString) => CellPosition[] | null;
    pullPath: (playerId: RecordIdString) => CellPosition | null;
    setMoveTime: (playerId: RecordIdString, time: number) => void;
    getMoveTime: (playerId: RecordIdString) => number | null;
    clearMoveTime: (playerId: RecordIdString) => void;
};

export const usePlayersStore = create<PlayerStoreState>((set, get) => ({
    playerStates: new Map<RecordIdString, PlayerMovementState>(),
    paths: new Map<RecordIdString, CellPosition[]>(),
    moveTimes: new Map<RecordIdString, number>(),

    setPlayerState: (playerId, playerState) => {
        set(state => ({ playerStates: new Map(state.playerStates).set(playerId, playerState) }));
    },

    getPlayerState: playerId => get().playerStates.get(playerId) ?? null,

    updatePlayerState: (playerId, patch) => {
        set(state => {
            const previous = state.playerStates.get(playerId);
            if (!previous) return state;

            return {
                playerStates: new Map(state.playerStates).set(playerId, { ...previous, ...patch }),
            };
        });
    },

    clearPlayerState: playerId => {
        set(state => {
            if (!state.playerStates.has(playerId)) return state;

            const playerStates = new Map(state.playerStates);
            playerStates.delete(playerId);
            return { playerStates };
        });
    },

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
