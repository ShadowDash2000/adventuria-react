import { useEffect } from 'react';
import type PocketBase from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActiveActor } from '@shared/query/requests/active-actors';
import { queryClient, queryKeys } from '@shared/query';

type NextShiftChangeData = { npc_id: RecordIdString; next_shift_change_at: IsoDateString };

interface NPCsNextShiftChangeSubscriptionProps {
    pb: PocketBase;
}

export const useNPCsNextShiftChangeSubscription = ({
    pb,
}: NPCsNextShiftChangeSubscriptionProps) => {
    useEffect(() => {
        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb.realtime
            .subscribe('next_shift_change', (data: NextShiftChangeData) => {
                if (disposed) return;

                queryClient.setQueryData<ActiveActor[]>(queryKeys.activeActors, oldActors => {
                    if (!oldActors) return oldActors;

                    return oldActors.map(actor => {
                        if (actor.id !== data.npc_id) {
                            return actor;
                        }

                        return { ...actor, next_shift_change_at: data.next_shift_change_at };
                    });
                });
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
    }, [pb]);
};
