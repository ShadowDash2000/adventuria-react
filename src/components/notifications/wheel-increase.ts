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
    const { isAuth, playerProgress, isPlayerProgressSuccess } = useAppContext();
    const [wheelCount, setWheelCount] = useState<number | null>(null);

    useEffect(() => {
        if (!isAuth || !isPlayerProgressSuccess) return;

        if (wheelCount === null) {
            setWheelCount(playerProgress.item_wheels_count);
            return;
        }

        if (wheelCount < playerProgress.item_wheels_count) {
            const wheelsAdded = playerProgress.item_wheels_count - wheelCount;

            toaster.create({
                type: 'info',
                title: 'Время крутить казик!',
                description: `Начислено ${wheelsAdded} ${wordMap.get(plural.select(wheelsAdded))}.`,
            });
            setWheelCount(playerProgress.item_wheels_count);
        } else if (wheelCount > playerProgress.item_wheels_count) {
            setWheelCount(playerProgress.item_wheels_count);
        }
    }, [isAuth, isPlayerProgressSuccess, playerProgress?.item_wheels_count]);
};
