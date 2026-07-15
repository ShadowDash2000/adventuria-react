import { useEffect, useRef, useState } from 'react';
import type PocketBase from 'pocketbase';
import { BoardHelper, type WorldBoard } from './BoardHelper';
import { usePlayersStore } from './players/usePlayersStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { pbCollections } from '@shared/pbSchema';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

type PlayersProgressSubscriptionProps = {
    pb: PocketBase;
    isAuth: boolean;
    playerId?: RecordIdString;
    initialProgress: PlayerProgressRecord[];
};

export const usePlayersProgressSubscription = ({
    pb,
    isAuth,
    playerId,
    initialProgress,
}: PlayersProgressSubscriptionProps) => {
    const [playersProgress, setPlayersProgress] = useState(
        () => new Map(initialProgress.map(progress => [progress.player, progress])),
    );
    const playersProgressRef = useRef(playersProgress);
    const worldsByIdRef = useRef<Map<string, WorldBoard>>(new Map());

    useEffect(() => {
        if (!isAuth) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb
            .collection(pbCollections.playersProgress)
            .subscribe<PlayerProgressRecord>('*', event => {
                if (event.action !== 'update') return;

                const previous = playersProgressRef.current.get(event.record.player);
                if (!previous) return;

                const isOwnRoll =
                    event.record.player === playerId && useRollDiceStore.getState().isRolling;

                if (!isOwnRoll) {
                    const previousWorld = worldsByIdRef.current.get(previous.current_world);
                    const nextWorld = worldsByIdRef.current.get(event.record.current_world);

                    if (
                        previous.current_world === event.record.current_world &&
                        previousWorld?.cellsCount
                    ) {
                        usePlayersStore
                            .getState()
                            .addPaths(
                                event.record.player,
                                BoardHelper.createPath(
                                    previousWorld,
                                    previous.cells_passed,
                                    event.record.cells_passed,
                                ),
                            );
                    } else if (nextWorld?.cellsCount) {
                        usePlayersStore
                            .getState()
                            .addPaths(event.record.player, [
                                BoardHelper.getCoords(nextWorld, event.record.cells_passed),
                            ]);
                    }
                }

                const next = new Map(playersProgressRef.current);
                next.set(event.record.player, event.record);
                playersProgressRef.current = next;
                setPlayersProgress(next);
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

    return { playersProgress, worldsByIdRef };
};
