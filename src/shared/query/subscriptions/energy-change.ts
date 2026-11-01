import { useAppContext } from '@context/AppContext';
import { useEffect } from 'react';
import { toaster } from '@ui/toaster';
import { invalidateGameState } from '@shared/query';

const wordMap = new Map<string, string>([
    ['one', 'очко'],
    ['two', 'очка'],
    ['few', 'очков'],
    ['many', 'очков'],
    ['other', 'очка'],
]);
const plural = new Intl.PluralRules('ru-RU');

type EnergyChangeData = { amount: number };

export const useEnergyChange = () => {
    const { pb, isAuth, gameState, isGameStateSuccess } = useAppContext();

    useEffect(() => {
        if (!isAuth || !isGameStateSuccess) return;

        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        pb.realtime
            .subscribe(
                `energy_change#${gameState.player_progress_id}`,
                async (data: EnergyChangeData) => {
                    if (data.amount > 0) {
                        toaster.create({
                            type: 'info',
                            title: 'Начислены очки энергии',
                            description: `Начислено ${data.amount} ${wordMap.get(plural.select(data.amount))} энергии.`,
                            closable: true,
                        });
                    }

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
