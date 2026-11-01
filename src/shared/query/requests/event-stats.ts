import type { PlayerRecord } from '@shared/types/player';
import type { CellRecord } from '@shared/types/cell';
import type { ItemRecord } from '@shared/types/item';
import { queryOptions } from '@tanstack/react-query';

export type EventStatsData = { stats: EventStatsEntries };

export type EventStatsEntries = {
    most_games_completed: EventUserStatEntry[];
    most_drops: EventUserStatEntry[];
    most_rerolls: EventUserStatEntry[];
    most_gyms_completed: EventUserStatEntry[];
    most_movies_watched: EventUserStatEntry[];
    most_karaoke_completed: EventUserStatEntry[];
    most_wanted: EventUserStatEntry[];
    most_items_used: EventUserStatEntry[];
    most_roblox_played: EventUserStatEntry[];
    most_happy_wheels_played: EventUserStatEntry[];
    most_visited_cells: EventCellStatEntry[];
    least_visited_cells: EventCellStatEntry[];
    most_used_items: EventItemStatEntry[];
};

export type EventUserStatEntry = { count: number; record: PlayerRecord };

export type EventCellStatEntry = { count: number; record: CellRecord };

export type EventItemStatEntry = { count: number; record: ItemRecord };

export type EventStatsSuccess = {
    success: true;
    data: EventStatsData;
    message?: string;
    error?: never;
};

export type EventStatsError = { success: false; data: never; message: string; error: never };

type EventStatsResult = EventStatsSuccess | EventStatsError;

const getEventStatsRequest = async (seasonId: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/event-stats?seasonId=${seasonId}`, {
        method: 'GET',
    });

    return (await res.json()) as EventStatsResult;
};

export const eventStatsQueryOptions = (seasonId: string) =>
    queryOptions({
        queryKey: ['event-stats', seasonId],
        queryFn: async () => {
            const result = await getEventStatsRequest(seasonId);

            if (!result.success) {
                throw new Error(result.message);
            }

            return result;
        },
    });
