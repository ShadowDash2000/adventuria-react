import type { RecordIdString } from '@shared/types/pocketbase';
import { usePlayersStore } from '@components/board/players/usePlayersStore';
import type { CellPosition } from '@components/board/BoardHelper';
const MOVE_TIME_DEFAULT = 1;

export const usePlayer = (userId: RecordIdString) => {
    const paths = usePlayersStore(state => state.getPaths(userId));
    const moveTime = usePlayersStore(state => state.getMoveTime(userId) || MOVE_TIME_DEFAULT);
    const addPaths = (paths: CellPosition[]) => {
        usePlayersStore.getState().addPaths(userId, paths);
    };
    const pullPath = () => usePlayersStore.getState().pullPath(userId);
    const setMoveTime = (time: number) => usePlayersStore.getState().setMoveTime(userId, time);
    const clearMoveTime = () => usePlayersStore.getState().clearMoveTime(userId);
    return { paths, moveTime, addPaths, pullPath, setMoveTime, clearMoveTime };
};
