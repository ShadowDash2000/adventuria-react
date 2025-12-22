import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import type { ActionRecord } from '@shared/types/action';
import { queryKeys } from '@shared/queryClient';
import type { ItemRecord } from '@shared/types/item';
import { LuLoader } from 'react-icons/lu';
import type { ClientResponseError } from 'pocketbase';
import type { RecordIdString } from '@shared/types/pocketbase';
import { For, Grid, GridItem, Text } from '@chakra-ui/react';
import { Item } from '@components/actions/buy-item/Item';

export const BuyItemContent = () => {
    const { pb, user } = useAppAuthContext();

    const latestAction = useQuery({
        queryFn: () =>
            pb
                .collection('actions')
                .getFirstListItem<ActionRecord>(`user = "${user.id}"`, { sort: '-created' }),
        queryKey: [...queryKeys.latestAction, 'buy-item'],
        refetchOnWindowFocus: false,
    });

    const items = useQuery({
        queryFn: () =>
            pb
                .collection('items')
                .getFullList<ItemRecord>({
                    filter: latestAction.data!.items_list.map(id => `id="${id}"`).join('||'),
                }),
        queryKey: [...queryKeys.shopItems, latestAction.data?.items_list],
        enabled: latestAction.isSuccess,
        refetchOnWindowFocus: false,
    });

    if (latestAction.isPending || items.isPending) {
        return <LuLoader />;
    }

    if (latestAction.isError) {
        const e = latestAction.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    if (items.isError) {
        const e = items.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    const shopItems = new Map<RecordIdString, ItemRecord>(items.data.map(item => [item.id, item]));

    return (
        <Grid
            templateColumns="repeat(3, 1fr)"
            gapX={4}
            position="absolute"
            w="full"
            pr="20%"
            pt="8%"
        >
            {shopItems.size && (
                <For each={latestAction.data.items_list}>
                    {(itemId, index) => (
                        <GridItem key={`${itemId}_${index}`}>
                            <Item item={shopItems.get(itemId)!} imageHeight="11vw" />
                        </GridItem>
                    )}
                </For>
            )}
        </Grid>
    );
};
