import { useEffect, useEffectEvent, useRef } from 'react';

interface UseIntervalOptions {
    ms: number;
    startImmediately?: boolean;
}

export const useInterval = (cb: () => void, { ms, startImmediately }: UseIntervalOptions) => {
    const id = useRef<number | null>(null);
    const onTick = useEffectEvent(cb);
    const immediatelyCalled = useRef(startImmediately);

    const handleClearInterval = () => {
        if (id.current) {
            window.clearInterval(id.current);
        }
        immediatelyCalled.current = false;
    };

    useEffect(() => {
        id.current = window.setInterval(onTick, ms);

        if (startImmediately && !immediatelyCalled.current) {
            onTick();
            immediatelyCalled.current = true;
        }

        return handleClearInterval;
    }, [ms, startImmediately, handleClearInterval]);

    return handleClearInterval;
};
