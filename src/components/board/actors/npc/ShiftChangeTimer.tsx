import { Text, type TextProps } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import type { IsoDateString } from '@shared/types/pocketbase';
import { formatSecondsToString } from '@shared/helpers/helper';

interface ShiftChangeTimerTooltipProps extends Omit<TextProps, 'ref'> {
    nextShiftChangeAt?: IsoDateString;
}

export const ShiftChangeTimer = ({
    nextShiftChangeAt,
    ...textProps
}: ShiftChangeTimerTooltipProps) => {
    const timerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!nextShiftChangeAt) return;

        let secondsLeft = Math.floor((new Date(nextShiftChangeAt).getTime() - Date.now()) / 1000);

        if (secondsLeft <= 0) return;

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
    }, [nextShiftChangeAt]);

    return (
        <Text {...textProps} ref={timerRef}>
            00:00:00
        </Text>
    );
};
