import type { RecordIdString } from '@shared/types/pocketbase';
import {
    usePlayersStore,
    type PlayerMovementState,
} from '@components/board/players/usePlayersStore';
import type { CellPosition } from '@components/board/BoardHelper';

const MOVE_TIME_DEFAULT = 1;

export const usePlayer = (playerId: RecordIdString) => {
    const playerState = usePlayersStore(state => state.getPlayerState(playerId));
    const paths = usePlayersStore(state => state.getPaths(playerId));
    const moveTime = usePlayersStore(state => state.getMoveTime(playerId) || MOVE_TIME_DEFAULT);

    const getPlayerState = () => usePlayersStore.getState().getPlayerState(playerId);
    const setPlayerState = (playerState: PlayerMovementState) =>
        usePlayersStore.getState().setPlayerState(playerId, playerState);
    const updatePlayerState = (patch: Partial<PlayerMovementState>) =>
        usePlayersStore.getState().updatePlayerState(playerId, patch);
    const clearPlayerState = () => usePlayersStore.getState().clearPlayerState(playerId);

    const addPaths = (paths: CellPosition[]) => {
        usePlayersStore.getState().addPaths(playerId, paths);
    };
    const pullPath = () => usePlayersStore.getState().pullPath(playerId);

    const setMoveTime = (time: number) => usePlayersStore.getState().setMoveTime(playerId, time);
    const clearMoveTime = () => usePlayersStore.getState().clearMoveTime(playerId);

    return {
        playerState,
        paths,
        moveTime,
        getPlayerState,
        setPlayerState,
        updatePlayerState,
        clearPlayerState,
        addPaths,
        pullPath,
        setMoveTime,
        clearMoveTime,
    };
};
