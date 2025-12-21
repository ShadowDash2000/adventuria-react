import { useEffect, useEffectEvent, useRef } from 'react';

interface UseIntervalWhenOptions {
    ms: number;
    when: boolean;
    startImmediately?: boolean;
}

export const useIntervalWhen = (
    cb: () => void,
    { ms, when, startImmediately }: UseIntervalWhenOptions,
) => {
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
        if (when) {
            id.current = window.setInterval(onTick, ms);

            if (startImmediately && !immediatelyCalled.current) {
                onTick();
                immediatelyCalled.current = true;
            }

            return handleClearInterval;
        }
    }, [ms, when, startImmediately, handleClearInterval]);

    return handleClearInterval;
};
