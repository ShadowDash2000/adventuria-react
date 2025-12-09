import { type FC, useMemo } from 'react';
import PocketBase from 'pocketbase';
import { useParams } from 'react-router-dom';
import { TimerSimple } from '../board/timer/TimerSimple';

export const Timer: FC = () => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const userId = useParams().userId;

    if (!userId) return null;

    return (
        <TimerSimple collection={pb.collection('timers')} userId={userId} realtimeUpdate={true} />
    );
};
