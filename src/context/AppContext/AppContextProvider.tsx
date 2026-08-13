import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { AppProviderType, AppContextProviderProps } from './types';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { AppContext, pb } from './index';
import { pbCollections, playerProgressSchema } from '@shared/pbSchema';
import { and, eq } from '@shared/pbFilter';
import { ApiError } from '@shared/types/api-error';
import { ClientResponseError } from 'pocketbase';

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(pb.authStore.isValid);
    const login = () => {
        setIsAuth(true);
    };
    const logout = () => {
        pb.authStore.clear();
        setIsAuth(false);
    };

    const { data: player = pb.authStore.record as PlayerRecord } = useQuery({
        queryFn: () => {
            setIsAuth(pb.authStore.isValid);
            return pb
                .collection(pbCollections.players)
                .getOne<PlayerRecord>(pb.authStore.record!.id);
        },
        enabled: isAuth,
        queryKey: [...queryKeys.playerAuth, isAuth, pb.authStore.record?.id],
        refetchOnWindowFocus: false,
    });

    const {
        data: availableActions = [],
        isPending: isAvailableActionsPending,
        isSuccess: isAvailableActionsSuccess,
        isError: isAvailableActionsError,
        error: availableActionsError,
    } = useQuery({
        queryFn: async () => {
            const res = await getAvailableActions(pb.authStore.token);

            if (!res.success) {
                throw new ApiError(res.message, res.error);
            }

            return res.data;
        },
        enabled: isAuth,
        queryKey: [...queryKeys.availableActions, isAuth, pb.authStore.token],
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (failureCount >= 3) {
                return false;
            }

            return !(error instanceof ApiError);
        },
    });

    const {
        data: currentSeason,
        isPending: isCurrentSeasonPending,
        isSuccess: isCurrentSeasonSuccess,
        isError: isCurrentSeasonError,
        error: currentSeasonError,
    } = useQuery({
        queryFn: async () => {
            const res = await getCurrentSeason();

            if (!res.success) {
                throw new Error(res.message);
            }

            return res.data;
        },
        queryKey: [...queryKeys.currentSeason],
        refetchOnWindowFocus: false,
    });

    const {
        data: playerProgress,
        isPending: isPlayerProgressPending,
        isSuccess: isPlayerProgressSuccess,
        isError: isPlayerProgressError,
        error: playerProgressError,
    } = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFirstListItem<PlayerProgressRecord>(
                    and(
                        eq(playerProgressSchema.player, player.id),
                        eq(playerProgressSchema.season, currentSeason!),
                    ),
                ),
        enabled: isAuth && isCurrentSeasonSuccess,
        queryKey: queryKeys.playerProgressAuth,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
            if (failureCount >= 3) {
                return false;
            }

            if (error instanceof ClientResponseError) {
                const e = error as ClientResponseError;
                return e.status !== 404;
            }

            return true;
        },
    });

    useEffect(() => {
        if (!isAuth) {
            pb.authStore.clear();
        }
    }, []);

    const ctx = {
        pb,
        player: isAuth ? player : null,
        login,
        logout,
        isAuth,
        availableActions,
        isAvailableActionsPending,
        isAvailableActionsSuccess,
        isAvailableActionsError,
        availableActionsError,
        currentSeason,
        isCurrentSeasonPending: isCurrentSeasonPending,
        isCurrentSeasonSuccess,
        isCurrentSeasonError,
        currentSeasonError,
        playerProgress,
        isPlayerProgressPending,
        isPlayerProgressSuccess,
        isPlayerProgressError,
        playerProgressError,
    } as AppProviderType;

    return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

type AvailableActionsSuccess = { success: true; data: string[]; message?: string; error?: never };

type AvailableActionsError = { success: false; data: never; message: string; error: string };

type AvailableActionsResult = AvailableActionsSuccess | AvailableActionsError;

const getAvailableActions = async (authToken: string): Promise<AvailableActionsResult> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/available-actions`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as AvailableActionsResult;
};

type CurrentSeasonSuccess = { success: true; data: string; message?: string; error?: never };

type CurrentSeasonError = { success: false; data: never; message: string; error: string };

type CurrentSeasonResult = CurrentSeasonSuccess | CurrentSeasonError;

const getCurrentSeason = async (): Promise<CurrentSeasonResult> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/current-season`, { method: 'GET' });

    return (await res.json()) as CurrentSeasonResult;
};
