import { useEffect } from 'react';
import type PocketBase from 'pocketbase';
import { invalidateAvailableActions, invalidateCells } from '@shared/queryClient';

type CellsSubscriptionProps = { pb: PocketBase; isAuth: boolean };

export const useCellsSubscription = ({ pb, isAuth }: CellsSubscriptionProps) => {
    useEffect(() => {
        if (!isAuth) return;

        let disposed = false;
        let unsubscribeFuncs: (() => void)[] = [];

        pb.realtime
            .subscribe('cell_events_scheduler_start', async () => {
                await invalidateAvailableActions();
            })
            .then(callback => {
                if (disposed) {
                    void callback();
                } else {
                    unsubscribeFuncs.push(callback);
                }
            });

        pb.realtime
            .subscribe('cell_events_scheduler_end', async () => {
                await invalidateCells();
                await invalidateAvailableActions();
            })
            .then(callback => {
                if (disposed) {
                    void callback();
                } else {
                    unsubscribeFuncs.push(callback);
                }
            });

        return () => {
            disposed = true;
            unsubscribeFuncs.forEach(unsubscribe => void unsubscribe());
        };
    }, [pb, isAuth]);
};
