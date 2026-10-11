import { useAppContext } from '@context/AppContext';
import { useEffect, useState } from 'react';
import { toaster } from '@ui/toaster';

const wordMap = new Map<string, string>([
    ['one', 'колесо'],
    ['two', 'колеса'],
    ['few', 'колёс'],
    ['many', 'колёс'],
    ['other', 'колеса'],
]);
const plural = new Intl.PluralRules('ru-RU');

export const useWheelIncrease = () => {
    const { isAuth, gameState, isGameStateSuccess } = useAppContext();
    const [wheelCount, setWheelCount] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuth || !isGameStateSuccess) return;

        if (wheelCount === null) {
            setWheelCount(gameState.item_wheels_count);
            return;
        }

        if (wheelCount < gameState.item_wheels_count) {
            const wheelsAdded = gameState.item_wheels_count - wheelCount;

            toaster.create({
                type: 'info',
                title: 'Время крутить казик!',
                description: `Начислено ${wheelsAdded} ${wordMap.get(plural.select(wheelsAdded))}.`,
            });
            setWheelCount(gameState.item_wheels_count);
        } else if (wheelCount > gameState.item_wheels_count) {
            setWheelCount(gameState.item_wheels_count);
        }
    }, [
        isAuth,
        isGameStateSuccess,
        isAuth && isGameStateSuccess ? gameState.item_wheels_count : 0,
    ]);
};
