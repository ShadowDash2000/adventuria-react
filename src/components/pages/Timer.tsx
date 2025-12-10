import { useMemo } from 'react';
import PocketBase from 'pocketbase';
import { useParams } from 'react-router-dom';
import { TimerSimple } from '@components/timer/TimerSimple';

export const Timer = () => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const userId = useParams().userId;

    if (!userId) return null;

    return (
        <TimerSimple collection={pb.collection('timers')} userId={userId} realtimeUpdate={true} />
    );
};
