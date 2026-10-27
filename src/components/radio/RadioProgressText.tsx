import { useState } from 'react';
import { useInterval } from '@shared/hook/useInterval';
import { Text } from '@chakra-ui/react';

interface RadioProgressTextProps {
    currentTime: () => number;
    duration: () => number;
}

export const RadioProgressText = ({ currentTime, duration }: RadioProgressTextProps) => {
    const [text, setText] = useState('00:00/00:00');

    useInterval(
        () => {
            setText(`${formatTime(currentTime())}/${formatTime(duration())}`);
        },
        { ms: 250, startImmediately: true },
    );

    return <Text fontVariantNumeric="tabular-nums">{text}</Text>;
};

function formatTime(seconds: number): string {
    const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;

    const minutes = Math.floor(total / 60);
    const remainder = total % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
}
