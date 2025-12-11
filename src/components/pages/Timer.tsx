import { useParams } from 'react-router-dom';
import { TimerSimple } from '@components/timer/TimerSimple';

const Timer = () => {
    const userId = useParams().userId;

    if (!userId) return null;

    return <TimerSimple userId={userId} realtimeUpdate={true} />;
};

export default Timer;
