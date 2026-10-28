import { useAppContext } from '@context/AppContext';
import { useEffect, useRef } from 'react';
import { Text, type TextProps } from '@chakra-ui/react';

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

function formatSecondsToString(timeSeconds: number) {
    const hours = String(Math.floor(timeSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timeSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(timeSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
