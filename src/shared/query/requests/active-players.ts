import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';

export type ActivePlayer = {
    id: RecordIdString;
    name: string;
    avatar: string;
    color: string;
    is_stream_live: boolean;
    progress: ActivePlayerProgress;
};

export type ActivePlayerProgress = {
    id: RecordIdString;
    updated: IsoDateString;
    current_world: RecordIdString;
    cells_passed: number;
};

type GetActivePlayersSuccess = {
    success: true;
    data: ActivePlayer[];
    message?: string;
    error?: never;
};

type GetActivePlayersError = { success: false; data: never; message: string; error: string };

type GetActivePlayersResult = GetActivePlayersSuccess | GetActivePlayersError;

const getActivePlayersRequest = async () => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/active-players`, { method: 'GET' });

    return (await res.json()) as GetActivePlayersResult;
};

export const activePlayersQueryOptions = () =>
    queryOptions({
        queryKey: queryKeys.activePlayers,
        queryFn: async () => {
            const result = await getActivePlayersRequest();

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data.map(player => ({
                ...player,
                avatar: new URL(player.avatar, import.meta.env.VITE_PB_URL).href,
            }));
        },
    });
