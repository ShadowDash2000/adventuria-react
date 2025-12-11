import { useRef } from 'react';
import { Text } from '@chakra-ui/react';
import { useTimer } from './useTimer';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useAppContext } from '../../context/AppContextProvider';

interface TimerSimpleProps {
    userId: RecordIdString;
    realtimeUpdate?: boolean;
}

export const TimerSimple = ({ userId, realtimeUpdate = false }: TimerSimpleProps) => {
    const { pb } = useAppContext();
    const timerRef = useRef<HTMLParagraphElement | null>(null);
    useTimer({
        collection: pb.collection('timers'),
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
