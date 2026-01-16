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
    const { isAuth, user } = useAppContext();
    const [wheelCount, setWheelCount] = useState<number | null>(
        isAuth ? user.itemWheelsCount : null,
    );

    useEffect(() => {
        if (!isAuth) return;
        if (wheelCount === null) {
            setWheelCount(user.itemWheelsCount);
            return;
        }

        if (wheelCount < user.itemWheelsCount) {
            const wheelsAdded = user.itemWheelsCount - wheelCount;

            toaster.create({
                type: 'info',
                title: 'Время крутить казик!',
                description: `Начислено ${wheelsAdded} ${wordMap.get(plural.select(wheelsAdded))}.`,
            });
            setWheelCount(user.itemWheelsCount);
        } else if (wheelCount > user.itemWheelsCount) {
            setWheelCount(user.itemWheelsCount);
        }
    }, [isAuth, user?.itemWheelsCount]);
};
