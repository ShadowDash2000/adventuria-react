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

export type ActiveNPC = { id: RecordIdString; name: string; avatar: string; color: string };

type GetActiveActorsListSuccess = {
    success: true;
    data: { players: ActivePlayer[]; npcs: ActiveNPC[] };
    message?: string;
    error?: never;
};

type GetActiveActorsListError = { success: false; data: never; message: string; error: string };

type GetActiveActorsListResult = GetActiveActorsListSuccess | GetActiveActorsListError;

const getActiveActorsListRequest = async () => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/active-actors-list`, {
        method: 'GET',
    });

    return (await res.json()) as GetActiveActorsListResult;
};

export const activeActorsListQueryOptions = () =>
    queryOptions({
        queryKey: queryKeys.activeActorsList,
        queryFn: async () => {
            const res = await getActiveActorsListRequest();

            if (!res.success) {
                throw new Error(res.message);
            }

            res.data.players = res.data.players.map(player => ({
                ...player,
                avatar: new URL(player.avatar, import.meta.env.VITE_PB_URL).href,
            }));

            res.data.npcs = res.data.npcs.map(npc => ({
                ...npc,
                avatar: new URL(npc.avatar, import.meta.env.VITE_PB_URL).href,
            }));

            return res.data;
        },
    });
