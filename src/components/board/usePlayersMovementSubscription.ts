import { useEffect, useRef } from 'react';
import type PocketBase from 'pocketbase';
import { BoardHelper, type CellPosition, type WorldBoard } from './BoardHelper';
import { usePlayersStore } from './players/usePlayersStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { Move } from '@shared/types/move';

type PlayerMoveData = { player_id: RecordIdString; moves: Move[] };

type PlayersProgressSubscriptionProps = {
    pb: PocketBase;
    isAuth: boolean;
    playerId: RecordIdString | null;
    worldsById: Map<string, WorldBoard>;
};

export const usePlayersMovementSubscription = ({
    pb,
    isAuth,
    playerId,
    worldsById,
}: PlayersProgressSubscriptionProps) => {
    const worldsByIdRef = useRef(worldsById);

    useEffect(() => {
        worldsByIdRef.current = worldsById;
    }, [worldsById]);

    useEffect(() => {
        if (!isAuth) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb.realtime
            .subscribe('player_moved', (data: PlayerMoveData) => {
                if (disposed) return;
                if (data.player_id === playerId && useRollDiceStore.getState().isRolling) return;

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
                    usePlayersStore.getState().addPaths(data.player_id, paths);
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
