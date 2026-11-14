import type { RecordIdString } from '@shared/types/pocketbase';
import { useActorsStore, type ActorMovementState } from '@components/board/actors/useActorsStore';
import type { CellPosition } from '@components/board/BoardHelper';

const MOVE_TIME_DEFAULT = 1;

export const useActor = (actorId: RecordIdString) => {
    const actorState = useActorsStore(state => state.getActorState(actorId));
    const paths = useActorsStore(state => state.getPaths(actorId));
    const moveTime = useActorsStore(state => state.getMoveTime(actorId) || MOVE_TIME_DEFAULT);

    const getActorState = () => useActorsStore.getState().getActorState(actorId);
    const setActorState = (actorState: ActorMovementState) =>
        useActorsStore.getState().setActorState(actorId, actorState);
    const updateActorState = (patch: Partial<ActorMovementState>) =>
        useActorsStore.getState().updateActorState(actorId, patch);
    const clearActorState = () => useActorsStore.getState().clearActorState(actorId);

    const addPaths = (paths: CellPosition[]) => {
        useActorsStore.getState().addPaths(actorId, paths);
    };
    const pullPath = () => useActorsStore.getState().pullPath(actorId);

    const setMoveTime = (time: number) => useActorsStore.getState().setMoveTime(actorId, time);
    const clearMoveTime = () => useActorsStore.getState().clearMoveTime(actorId);

    return {
        actorState,
        paths,
        moveTime,
        getActorState,
        setActorState,
        updateActorState,
        clearActorState,
        addPaths,
        pullPath,
        setMoveTime,
        clearMoveTime,
    };
};
