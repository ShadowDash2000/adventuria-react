import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import {
    queryKeys,
    invalidateAvailableActions,
    invalidateRefreshShopView,
    invalidateShopView,
    invalidatePlayerProgressAuth,
} from '@shared/queryClient';
import { ButtonProps, Spinner, Text } from '@chakra-ui/react';
import { Button } from '@theme/button';
import type { ClientResponseError } from 'pocketbase';
import { Coin } from '@shared/components/Coin';
import { useState } from 'react';
import { handleApiResponse } from '@shared/helpers/api';

export const RefreshShopButton = ({ ...props }: ButtonProps) => {
    const {
        pb,
        availableActions,
        playerProgress,
        isPlayerProgressPending,
        isPlayerProgressSuccess,
    } = useAppAuthContext();
    const [loading, setLoading] = useState(false);

    const isRefreshShopAvailable = availableActions.includes('refresh_shop');
    const refreshShopView = useQuery({
        queryFn: () => getRefreshShopView(pb.authStore.token),
        queryKey: [...queryKeys.refreshShopView],
        enabled: isRefreshShopAvailable,
        refetchOnWindowFocus: false,
    });

    const handleRefreshShop = async () => {
        const res = await refreshShopRequest(pb.authStore.token);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidatePlayerProgressAuth();
        await invalidateAvailableActions();
        await invalidateShopView();
        await invalidateRefreshShopView();
    };

    if (!isRefreshShopAvailable) {
        return null;
    }

    if (refreshShopView.isPending) {
        return <Spinner />;
    }

    if (refreshShopView.isError) {
        const e = refreshShopView.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Button
            {...props}
            loading={loading || isPlayerProgressPending}
            disabled={
                isPlayerProgressSuccess &&
                playerProgress.balance < refreshShopView.data.data.refresh_price
            }
            onClick={async () => {
                try {
                    setLoading(true);
                    await handleRefreshShop();
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }}
        >
            Обновить {refreshShopView.data.data.refresh_price}
            <Coin w={8} h={8} />
        </Button>
    );
};

type GetRefreshShopViewData = { refresh_price: number };

type GetRefreshShopViewSuccess = { success: true; data: GetRefreshShopViewData; error?: never };

type GetRefreshShopViewError = { success: false; data: never; error: string };

type GetRefreshShopViewResult = GetRefreshShopViewSuccess | GetRefreshShopViewError;

const getRefreshShopView = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-view?action=refresh_shop`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    return (await res.json()) as GetRefreshShopViewResult;
};

type RefreshShopSuccess = { success: true; message?: string; error?: never };

type RefreshShopError = { success: false; message: string; error: string };

type RefreshResult = RefreshShopSuccess | RefreshShopError;

const refreshShopRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/refresh-shop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    });

    return (await res.json()) as RefreshResult;
};
