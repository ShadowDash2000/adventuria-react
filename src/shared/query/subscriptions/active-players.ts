import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import { queryKeys } from '@shared/query';

export const useActivePlayersSubscription = () => {
    const { pb } = useAppContext();
    const queryClient = useQueryClient();

    useEffect(() => {
        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        void pb.realtime
            .subscribe('new_player', () => {
                if (disposed) return;

                void queryClient.invalidateQueries({ queryKey: queryKeys.activePlayers });
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
    }, [pb, queryClient]);
};
