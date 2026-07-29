import { useEffect } from 'react';
import type PocketBase from 'pocketbase';
import type { CellEventRecord } from '@shared/types/cell_event';
import { pbCollections } from '@shared/pbSchema';
import { invalidateCells } from '@shared/queryClient';

type CellsSubscriptionProps = { pb: PocketBase; isAuth: boolean };

export const useCellsSubscription = ({ pb, isAuth }: CellsSubscriptionProps) => {
    useEffect(() => {
        if (!isAuth) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb
            .collection(pbCollections.cellEventsSchedule)
            .subscribe<CellEventRecord>('*', async event => {
                if (event.action !== 'update') return;

                await invalidateCells();
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
    }, [pb, isAuth]);
};
