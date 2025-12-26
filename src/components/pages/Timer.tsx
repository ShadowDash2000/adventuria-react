import { useParams } from 'react-router-dom';
import { TimerSimple } from '@components/timer/TimerSimple';
import { Global } from '@emotion/react';

const Timer = () => {
    const userId = useParams().userId;

    if (!userId) return null;

    return (
        <>
            <Global
                styles={{
                    'html, body, #root': {
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                    },
                }}
            />
            <TimerSimple userId={userId} realtimeUpdate={true} fontSize="min(30vw, 100vh)" />
        </>
    );
};

export default Timer;
