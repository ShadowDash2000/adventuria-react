import { useAppContext } from '@context/AppContext';
import { useEffect } from 'react';
import { toaster } from '@ui/toaster';
import { invalidateGameState } from '@shared/queryClient';

const wordMap = new Map<string, string>([
    ['one', 'монета'],
    ['two', 'монеты'],
    ['few', 'монет'],
    ['many', 'монет'],
    ['other', 'монеты'],
]);
const plural = new Intl.PluralRules('ru-RU');

type BalanceChangeData = { balance: number };

export const useBalanceIncrease = () => {
    const { pb, isAuth, gameState, isGameStateSuccess } = useAppContext();

    useEffect(() => {
        if (!isAuth || !isGameStateSuccess) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        pb.realtime
            .subscribe(
                `balance_change#${gameState.player_progress_id}`,
                async (data: BalanceChangeData) => {
                    if (data.balance <= 0) return;

                    toaster.create({
                        type: 'info',
                        title: 'Начислены монеты',
                        description: `Начислено ${data.balance} ${wordMap.get(plural.select(data.balance))}.`,
                        closable: true,
                    });

                    await invalidateGameState();
                },
            )
            .then(callback => {
                if (disposed) {
                    void callback();
                } else {
                    unsubscribe = callback;
                }
            });

        return () => {
            disposed = true;
            unsubscribe?.();
        };
    }, [
        pb,
        isAuth,
        isGameStateSuccess,
        isAuth && isGameStateSuccess ? gameState.player_progress_id : null,
    ]);
};
