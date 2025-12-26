import { useRef } from 'react';
import { Text, type TextProps } from '@chakra-ui/react';
import { useTimer } from './useTimer';
import type { RecordIdString } from '@shared/types/pocketbase';

interface TimerSimpleProps extends TextProps {
    userId: RecordIdString;
    realtimeUpdate?: boolean;
}

export const TimerSimple = ({ userId, realtimeUpdate = false, ...rest }: TimerSimpleProps) => {
    const timerRef = useRef<HTMLParagraphElement | null>(null);
    useTimer({
        userId: userId,
        realtimeUpdate: realtimeUpdate,
        onValueChange: value => {
            if (!timerRef.current) return;
            timerRef.current.innerText = value;
        },
    });

    return (
        <Text lineHeight={1} textAlign="center" {...rest} ref={timerRef}>
            00:00:00
        </Text>
    );
};
