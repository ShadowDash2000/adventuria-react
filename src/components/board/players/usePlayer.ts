import type { RecordIdString } from '@shared/types/pocketbase';
import { usePlayersStore } from '@components/board/players/usePlayersStore';
import type { CellPosition } from '@components/board/BoardHelper';
const MOVE_TIME_DEFAULT = 1;

export const usePlayer = (playerId: RecordIdString) => {
    const paths = usePlayersStore(state => state.getPaths(playerId));
    const moveTime = usePlayersStore(state => state.getMoveTime(playerId) || MOVE_TIME_DEFAULT);
    const addPaths = (paths: CellPosition[]) => {
        usePlayersStore.getState().addPaths(playerId, paths);
    };
    const pullPath = () => usePlayersStore.getState().pullPath(playerId);
    const setMoveTime = (time: number) => usePlayersStore.getState().setMoveTime(playerId, time);
    const clearMoveTime = () => usePlayersStore.getState().clearMoveTime(playerId);
    return { paths, moveTime, addPaths, pullPath, setMoveTime, clearMoveTime };
};
