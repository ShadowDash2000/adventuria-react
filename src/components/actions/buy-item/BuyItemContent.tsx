import type { ItemRecord } from '@shared/types/item';
import type { ClientResponseError } from 'pocketbase';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { For, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react';
import { Item } from '@components/actions/buy-item/Item';
import { RefreshShopButton } from './RefreshShopButton';

export const BuyItemContent = () => {
    const { pb } = useAppAuthContext();

    const items = useQuery({
        queryFn: () => getBuyVariants(pb.authStore.token),
        queryKey: [...queryKeys.shopItems],
        refetchOnWindowFocus: false,
    });

    if (items.isPending) {
        return <Spinner />;
    }

    if (items.isError) {
        const e = items.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <VStack position="absolute" w="full" pr="20%" pt="8%" gapY={24}>
            <Grid templateColumns="repeat(3, 1fr)" w="full" gapX={4} userSelect="none">
                <For each={items.data.data.items}>
                    {(item, index) => (
                        <GridItem key={`${item.id}_${index}`}>
                            <Item item={item} imageHeight="11vw" />
                        </GridItem>
                    )}
                </For>
            </Grid>
            <RefreshShopButton />
        </VStack>
    );
};

type GetBuyVariantsData = { items: ItemRecord[] };

type GetBuyVariantsSuccess = { success: true; data: GetBuyVariantsData; error?: never };

type GetBuyVariantsError = { success: false; data: never; error: never };

type GetBuyVariantsResult = GetBuyVariantsSuccess | GetBuyVariantsError;

const getBuyVariants = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-variants?action=buyItem`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to get buy variants`);
    }

    return (await res.json()) as GetBuyVariantsResult;
};
