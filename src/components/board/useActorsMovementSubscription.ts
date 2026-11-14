import { useEffect, useRef } from 'react';
import type PocketBase from 'pocketbase';
import { BoardHelper, type CellPosition, type WorldBoard } from './BoardHelper';
import { useActorsStore } from '@components/board/actors/useActorsStore';
import { useRollDice } from '@components/dices';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ActorKind } from '@shared/types/actor';
import type { Move } from '@shared/types/move';

type ActorMoveData = { actor_id: RecordIdString; actor_kind: ActorKind; moves: Move[] };

type ActorMovementSubscriptionProps = {
    pb: PocketBase;
    isAuth: boolean;
    playerId: RecordIdString | null;
    worldsById: Map<string, WorldBoard>;
};

export const useActorsMovementSubscription = ({
    pb,
    isAuth,
    playerId,
    worldsById,
}: ActorMovementSubscriptionProps) => {
    const worldsByIdRef = useRef(worldsById);
    const { getIsRolling } = useRollDice();

    useEffect(() => {
        worldsByIdRef.current = worldsById;
    }, [worldsById]);

    useEffect(() => {
        if (!isAuth) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb.realtime
            .subscribe('actor_moved', (data: ActorMoveData) => {
                if (disposed) return;
                if (data.actor_id === playerId && getIsRolling()) return;

                const paths: CellPosition[] = [];

                for (const move of data.moves) {
                    const world = worldsByIdRef.current.get(move.world_id);
                    if (!world?.cellsCount) continue;

                    if (move.type === 'path') {
                        paths.push(
                            ...BoardHelper.createPath(
                                world,
                                move.prev_total_steps,
                                move.total_steps,
                            ),
                        );
                        continue;
                    }

                    paths.push(BoardHelper.getCoords(world, move.cell_local_order));
                }

                if (paths.length) {
                    useActorsStore.getState().addPaths(data.actor_id, paths);
                }
            })
            .then(callback => {
                if (disposed) {
                    void callback();
                } else {
                    unsubscribe = callback;
                }
            });

        return () => {
            disposed = true;
            void unsubscribe?.();
        };
    }, [pb, isAuth, playerId]);
};
