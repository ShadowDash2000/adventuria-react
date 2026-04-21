import { useEffect, useState } from 'react';
import { ClientResponseError } from 'pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { SettingsRecord } from '@shared/types/settings';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { AppProviderType, AppContextProviderProps } from './types';
import { AppContext, pb } from './index';
import { pbCollections, playerProgressSchema } from '@shared/pbSchema';
import { and, eq } from '@shared/pbFilter';

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

    const { data: availableActions = [] } = useQuery({
        queryFn: async () => await fetchAvailableActions(pb.authStore.token),
        enabled: isAuth,
        queryKey: [...queryKeys.availableActions, isAuth, pb.authStore.token],
        refetchOnWindowFocus: false,
    });

    const {
        data: settings,
        isPending: isSettingsPending,
        isSuccess: isSettingsSuccess,
        isError: isSettingsError,
        error: settingsError,
    } = useQuery({
        queryFn: () => pb.collection(pbCollections.settings).getFirstListItem<SettingsRecord>(''),
        queryKey: [...queryKeys.settings],
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
                        eq(playerProgressSchema.season, settings!.current_season),
                    ),
                ),
        enabled: isAuth && isSettingsSuccess,
        queryKey: queryKeys.playerProgressAuth,
        refetchOnWindowFocus: false,
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
        settings,
        isSettingsPending,
        isSettingsSuccess,
        isSettingsError,
        settingsError,
        playerProgress,
        isPlayerProgressPending,
        isPlayerProgressSuccess,
        isPlayerProgressError,
        playerProgressError,
    } as AppProviderType;

    return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

const fetchAvailableActions = async (authToken: string): Promise<string[]> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/available-actions`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!res.ok) {
        throw await res.json().catch(() => {
            return new ClientResponseError({ status: res.status });
        });
    }

    return (await res.json()) as string[];
};
