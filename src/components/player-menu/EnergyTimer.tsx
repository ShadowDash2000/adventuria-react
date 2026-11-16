import { useAppContext } from '@context/AppContext';
import { useEffect, useRef } from 'react';
import { Text, type TextProps } from '@chakra-ui/react';
import { formatSecondsToString } from '@shared/helpers/helper';

interface EnergyTimerProps extends Omit<TextProps, 'ref'> {}

export const EnergyTimer = ({ ...textProps }: EnergyTimerProps) => {
    const { gameState, isGameStateSuccess, isGameStateError } = useAppContext();
    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isGameStateSuccess) return;

        let secondsLeft = Math.floor(
            (new Date(gameState.next_day_at).getTime() - Date.now()) / 1000,
        );

        if (timerRef.current) {
            timerRef.current.textContent = formatSecondsToString(secondsLeft);
        }

        const intervalId = setInterval(() => {
            secondsLeft -= 1;

            if (timerRef.current) {
                timerRef.current.textContent = formatSecondsToString(secondsLeft);
            }

            if (secondsLeft <= 0) {
                clearInterval(intervalId);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [isGameStateSuccess]);

    if (isGameStateError) {
        return null;
    }

    return (
        <Text {...textProps} ref={timerRef}>
            00:00:00
        </Text>
    );
};
