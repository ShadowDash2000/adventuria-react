import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellType } from '@shared/types/cell';
import type { ActivityType } from '@shared/types/activity';

export type CellDetailed = {
    id: RecordIdString;
    type: CellType;
    name: string;
    icon: string;
    color: string;
    description: string;
    points: number;
    done_energy_consume: number;
    drop_energy_consume: number;
    coins: number;
    average_campaign_time: number;

    activity_filter?: CellDetailedActivityFilter;
};

export type CellDetailedActivityFilter = {
    type: ActivityType;
    platforms: CellDetailedPlatform[];
    developers: CellDetailedCompany[];
    publishers: CellDetailedCompany[];
    genres: CellDetailedGenres[];
    tags: CellDetailedTags[];
    themes: CellDetailedThemes[];
    min_price: number;
    max_price: number;
    min_campaign_time: number;
    max_campaign_time: number;
    activities: CellDetailedActivity[];
};

export type CellDetailedPlatform = { id: RecordIdString; name: string };

export type CellDetailedCompany = { id: RecordIdString; name: string };

export type CellDetailedGenres = { id: RecordIdString; name: string };

export type CellDetailedTags = { id: RecordIdString; name: string };

export type CellDetailedThemes = { id: RecordIdString; name: string };

export type CellDetailedActivity = {
    id: RecordIdString;
    name: string;
    hltb_campaign_time: number;
    cover: string;
    cover_alt: string;
};

type GetCellDetailedSuccess = {
    success: true;
    data: CellDetailed;
    message?: string;
    error?: never;
};

type GetCellDetailedError = { success: false; data: never; message: string; error: string };

type GetCellDetailedResult = GetCellDetailedSuccess | GetCellDetailedError;

const getCellDetailedRequest = async (cellId: RecordIdString) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/cell?cellId=${cellId}`, {
        method: 'GET',
    });

    return (await res.json()) as GetCellDetailedResult;
};

export const cellDetailedQueryOptions = (cellId: RecordIdString) =>
    queryOptions({
        queryKey: queryKeys.cellDetailed(cellId),
        queryFn: async () => {
            const res = await getCellDetailedRequest(cellId);

            if (!res.success) {
                throw new Error(res.message);
            }

            res.data.icon = new URL(res.data.icon, import.meta.env.VITE_PB_URL).href;

            if (res.data.activity_filter?.activities) {
                res.data.activity_filter.activities = res.data.activity_filter.activities.map(
                    activity => ({
                        ...activity,
                        cover_alt: new URL(activity.cover_alt, import.meta.env.VITE_PB_URL).href,
                    }),
                );
            }

            return res.data;
        },
    });
