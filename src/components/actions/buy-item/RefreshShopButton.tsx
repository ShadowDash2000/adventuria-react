import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import {
    invalidateAvailableActions,
    invalidateRefreshShopView,
    invalidateShopItems,
    invalidateUser,
    queryKeys,
} from '@shared/queryClient';
import { ButtonProps, Spinner, Text } from '@chakra-ui/react';
import { Button } from '@theme/button';
import type { ClientResponseError } from 'pocketbase';
import { Coin } from '@shared/components/Coin';
import { useState } from 'react';

export const RefreshShopButton = ({ ...props }: ButtonProps) => {
    const { pb, user, availableActions } = useAppAuthContext();
    const [loading, setLoading] = useState(false);

    const isRefreshShopAvailable = availableActions.includes('refreshShop');
    const refreshShopView = useQuery({
        queryFn: () => getRefreshShopView(pb.authStore.token),
        queryKey: [...queryKeys.refreshShopView],
        enabled: isRefreshShopAvailable,
        refetchOnWindowFocus: false,
    });

    const handleRefreshShop = async () => {
        const res = await refreshShopRequest(pb.authStore.token);

        if (!res.success) return;

        await invalidateUser();
        await invalidateAvailableActions();
        await invalidateShopItems();
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
            loading={loading}
            disabled={user.balance < refreshShopView.data.data.refresh_price}
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
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/action-variants?action=refreshShop`,
        { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } },
    );
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to get refresh items view`);
    }

    return (await res.json()) as GetRefreshShopViewResult;
};

type RefreshShopSuccess = { success: true; error?: never };

type RefreshShopError = { success: false; error: string };

type RefreshResult = RefreshShopSuccess | RefreshShopError;

const refreshShopRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/refresh-shop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to perform action`);
    }

    return (await res.json()) as RefreshResult;
};
