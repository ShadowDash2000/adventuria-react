import type { AppProviderType, AppContextProviderProps } from './types';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { AppContext, pb } from './index';
import { ApiError } from '@shared/types/api-error';
import { RecordIdString } from '@shared/types/pocketbase';

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(pb.authStore.isValid);
    const login = () => {
        setIsAuth(true);
    };
    const logout = () => {
        pb.authStore.clear();
        setIsAuth(false);
    };

    const {
        data: gameState,
        isPending: isGameStatePending,
        isSuccess: isGameStateSuccess,
        isError: isGameStateError,
        error: gameStateError,
    } = useQuery({
        queryFn: async () => {
            const res = await getGameState(pb.authStore.token);

            if (!res.success) {
                throw new ApiError(res.message, res.error);
            }

            return res.data;
        },
        queryKey: [...queryKeys.gameState, isAuth, pb.authStore.record?.id],
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

    useEffect(() => {
        if (!isAuth) {
            pb.authStore.clear();
        }
    }, []);

    const ctx = {
        pb,
        playerId: pb.authStore.record?.id,
        login,
        logout,
        isAuth,
        gameState,
        isGameStatePending,
        isGameStateSuccess,
        isGameStateError,
        gameStateError,
        availableActions,
        isAvailableActionsPending,
        isAvailableActionsSuccess,
        isAvailableActionsError,
        availableActionsError,
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

type GameState = {
    id?: RecordIdString;
    disabled?: boolean;
    debug?: boolean;
    season: RecordIdString;
    current_world?: RecordIdString;
    balance?: number;
    energy?: number;
    drops_in_a_row?: number;
    item_wheels_count?: number;
};

type GameStateSuccess = { success: true; data: GameState; message?: string; error?: never };

type GameStateError = { success: false; data: never; message: string; error: string };

type GameStateResult = GameStateSuccess | GameStateError;

const getGameState = async (authToken?: string): Promise<GameStateResult> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/game-state`, {
        method: 'GET',
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : undefined,
    });

    return (await res.json()) as GameStateResult;
};
