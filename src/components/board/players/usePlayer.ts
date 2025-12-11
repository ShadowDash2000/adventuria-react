import type { RecordIdString } from '@shared/types/pocketbase';
import { usePlayersStore } from '@components/board/players/usePlayersStore';
import type { CellPosition } from '@components/board/BoardHelper';
import { useCallback } from 'react';

const MOVE_TIME_DEFAULT = 1;

export const usePlayer = (userId: RecordIdString) => {
    const paths = usePlayersStore(state => state.getPaths(userId));
    const moveTime = usePlayersStore(state => state.getMoveTime(userId) || MOVE_TIME_DEFAULT);
    const addPaths = useCallback((paths: CellPosition[]) => {
        usePlayersStore.getState().addPaths(userId, paths);
    }, []);
    const pullPath = useCallback(() => usePlayersStore.getState().pullPath(userId), []);
    const setMoveTime = useCallback(
        (time: number) => usePlayersStore.getState().setMoveTime(userId, time),
        [],
    );
    const clearMoveTime = useCallback(() => usePlayersStore.getState().clearMoveTime(userId), []);
    return { paths, moveTime, addPaths, pullPath, setMoveTime, clearMoveTime };
};
