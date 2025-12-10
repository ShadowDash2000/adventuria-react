import { useRef } from 'react';
import { Text } from '@chakra-ui/react';
import { useTimer } from './useTimer';
import type { RecordService } from 'pocketbase';
import type { TimerRecord } from '@shared/types/timer';
import type { RecordIdString } from '@shared/types/pocketbase';

interface TimerSimpleProps {
    collection: RecordService<TimerRecord>;
    userId: RecordIdString;
    realtimeUpdate?: boolean;
}

export const TimerSimple = ({ collection, userId, realtimeUpdate = false }: TimerSimpleProps) => {
    const timerRef = useRef<HTMLParagraphElement | null>(null);
    useTimer({
        collection: collection,
        userId: userId,
        realtimeUpdate: realtimeUpdate,
        onValueChange: value => {
            if (!timerRef.current) return;
            timerRef.current.innerText = value;
        },
    });

    return (
        <Text fontSize="4xl" ref={timerRef}>
            00:00:00
        </Text>
    );
};
