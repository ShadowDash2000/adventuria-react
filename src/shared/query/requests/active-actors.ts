import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';
import type { ActorKind } from '@shared/types/actor';

export type ActiveActor = {
    id: RecordIdString;
    kind: ActorKind;
    updated: IsoDateString;
    name: string;
    avatar: string;
    color: string;
    current_world: RecordIdString;
    cells_passed: number;
};

type GetActiveActorsSuccess = {
    success: true;
    data: ActiveActor[];
    message?: string;
    error?: never;
};

type GetActiveActorsError = { success: false; data: never; message: string; error: string };

type GetActiveActorsResult = GetActiveActorsSuccess | GetActiveActorsError;

const getActiveActorsRequest = async () => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/active-actors`, { method: 'GET' });

    return (await res.json()) as GetActiveActorsResult;
};

export const activeActorsQueryOptions = () =>
    queryOptions({
        queryKey: queryKeys.activeActors,
        queryFn: async () => {
            const result = await getActiveActorsRequest();

            if (!result.success) {
                throw new Error(result.message);
            }

            return result.data.map(actor => ({
                ...actor,
                avatar: new URL(actor.avatar, import.meta.env.VITE_PB_URL).href,
            }));
        },
    });
