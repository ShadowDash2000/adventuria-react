import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';

export type CompletedActivity = {
    id: RecordIdString;
    name: string;
    cover: string;
    cover_alt: string;
    players: PlayerStatus[];
};

export type PlayerStatus = { player: Player; status: string; date: IsoDateString };

export type Player = { id: RecordIdString; name: string; avatar: string; color: string };

type GetCompletedActivitiesData = CompletedActivity[];

type GetCompletedActivitiesSuccess = {
    success: true;
    data: GetCompletedActivitiesData;
    message?: string;
    error?: never;
};

type GetCompletedActivitiesError = { success: false; data: never; message: string; error: string };

type GetCompletedActivitiesResult = GetCompletedActivitiesSuccess | GetCompletedActivitiesError;

const getCompletedActivities = async (cellId: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/completed-activities?cellId=${cellId}`,
        { method: 'GET' },
    );

    return (await res.json()) as GetCompletedActivitiesResult;
};

export const completedActivitiesQueryOptions = (cellId: string) =>
    queryOptions({
        queryKey: [...queryKeys.latestCompletedActivities(cellId)],
        queryFn: async () => {
            const result = await getCompletedActivities(cellId);

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data.map(activity => ({
                ...activity,
                cover_alt: activity.cover_alt
                    ? new URL(activity.cover_alt, import.meta.env.VITE_PB_URL).href
                    : '',
                players: activity.players.map(player => ({
                    ...player,
                    player: {
                        ...player.player,
                        avatar: new URL(player.player.avatar, import.meta.env.VITE_PB_URL).href,
                    },
                })),
            }));
        },
    });
