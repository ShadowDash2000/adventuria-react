import type { ClientResponseError } from 'pocketbase';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { For, Grid, GridItem, Spinner, Text, VStack } from '@chakra-ui/react';
import { Item } from '@components/actions/buy/Item';
import { RefreshShopButton } from './RefreshShopButton';
import { MotionBox } from '@shared/components/MotionBox';
import type { RecordIdString } from '@shared/types/pocketbase';

export const Content = () => {
    const { pb } = useAppAuthContext();

    const items = useQuery({
        queryFn: () => getBuyView(pb.authStore.token),
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
            <MotionBox whileHover={{ scale: 1.1 }}>
                <RefreshShopButton />
            </MotionBox>
        </VStack>
    );
};

export type ItemView = {
    id: RecordIdString;
    name: string;
    description: string;
    icon: string;
    price: number;
};

type GetBuyViewData = { items: ItemView[] };

type GetBuyViewSuccess = { success: true; data: GetBuyViewData; error?: never };

type GetBuyViewError = { success: false; data: never; error: never };

type GetBuyViewResult = GetBuyViewSuccess | GetBuyViewError;

const getBuyView = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/action-view?action=buy`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to get buy view`);
    }

    return (await res.json()) as GetBuyViewResult;
};
