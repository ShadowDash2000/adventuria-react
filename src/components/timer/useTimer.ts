import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import type { TimerRecord } from '@shared/types/timer';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { SettingsRecord } from '@shared/types/settings';
import { formatDateLocalized } from '@shared/helpers/helper';

interface TimerProps {
    authToken?: string;
    userId: RecordIdString;
    realtimeUpdate?: boolean;
    onValueChange?: (value: string) => void;
}

export const useTimer = ({
    authToken,
    userId,
    realtimeUpdate = false,
    onValueChange,
}: TimerProps) => {
    const { pb } = useAppContext();
    const [timer, setTimer] = useState<TimerRecord | null>(null);
    const [nextResetDate, setNextResetDate] = useState('');
    const [isActive, setIsActive] = useState<boolean>(false);

    const timerCollection = pb.collection('timers');

    const timerQuery = useQuery({
        queryFn: () => timerCollection.getFirstListItem<TimerRecord>(`user = "${userId}"`),
        queryKey: ['timer', userId],
        refetchOnWindowFocus: false,
    });

    const settingsQuery = useQuery({
        queryFn: () => pb.collection('settings').getFirstListItem<SettingsRecord>(''),
        queryKey: queryKeys.settings,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!timerQuery.isSuccess) {
            setTimer(null);
            return;
        }
        setTimer(timerQuery.data);
        setIsActive(timerQuery.data.isActive);
    }, [timerQuery.data]);

    useEffect(() => {
        if (!settingsQuery.isSuccess) return;

        const { eventDateStart, currentWeek } = settingsQuery.data;
        const startDate = new Date(eventDateStart);

        const weeksOffsetMs = currentWeek * 7 * 24 * 60 * 60 * 1000;
        const nextReset = new Date(startDate.getTime() + weeksOffsetMs);

        setNextResetDate(formatDateLocalized(nextReset.toISOString()));
    }, [settingsQuery.data]);

    useEffect(() => {
        if (!realtimeUpdate || !timer) return;

        timerCollection.subscribe<TimerRecord>(timer.id, data => {
            if (data.action !== 'update') return;
            setTimer(data.record);
            setIsActive(data.record.isActive);
        });

        return () => {
            timerCollection.unsubscribe(timer.id);
        };
    }, [realtimeUpdate, timer]);

    useEffect(() => {
        if (!timer) {
            if (onValueChange) onValueChange('00:00:00');
            return;
        }

        let timeLeftMs = (timer.timeLimit - timer.timePassed) * 1000;
        if (timer.isActive && timer.startTime) {
            const now = Date.now();
            const startTime = new Date(timer.startTime);
            timeLeftMs -= now - startTime.getTime();
        }
        let initTime = Math.floor(timeLeftMs / 1000);

        if (onValueChange) onValueChange(formatSecondsToString(initTime, initTime < 0));

        if (!isActive) return;

        const intervalId = setInterval(() => {
            initTime -= 1;
            if (onValueChange) onValueChange(formatSecondsToString(initTime, initTime < 0));
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [isActive, timer, userId]);

    return {
        isActive,
        nextResetDate,
        startTimer: async () => {
            if (!authToken) return;
            try {
                await startTimer(authToken);
                setIsActive(true);
            } catch (e) {
                console.error(e);
            }
        },
        stopTimer: async () => {
            if (!authToken) return;
            try {
                await stopTimer(authToken);
                setIsActive(false);
            } catch (e) {
                console.error(e);
            }
        },
    };
};

const startTimer = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/timer/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to start timer`);
    }

    return res.ok;
};

const stopTimer = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/timer/stop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(text || `Failed to stop timer`);
    }

    return res.ok;
};

const formatSecondsToString = (time: number, isNegative: boolean) => {
    time = Math.abs(time);
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return (isNegative ? '-' : '') + `${hours}:${minutes}:${seconds}`;
};
