import { Box, Dialog, For, Grid, GridItem, Image, Portal, Text } from '@chakra-ui/react';
import { Button } from '@ui/button';
import { LuLoader, LuShoppingCart } from 'react-icons/lu';
import type { RecordIdString } from '@shared/types/pocketbase';
import ShopImage from '/shop.png';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { useAppAuthContext } from '@context/AppContext';
import type { ActionRecord } from '@shared/types/action';
import type { ItemRecord } from '@shared/types/item';
import { type ClientResponseError } from 'pocketbase';
import { Item } from '@components/actions/buy-item/Item';

export const BuyItemModal = () => {
    const { pb, user } = useAppAuthContext();

    const latestAction = useQuery({
        queryFn: () =>
            pb
                .collection('actions')
                .getFirstListItem<ActionRecord>(`user = "${user.id}"`, { sort: '-created' }),
        queryKey: queryKeys.latestAction,
        refetchOnWindowFocus: false,
    });

    const items = useQuery({
        queryFn: () =>
            pb
                .collection('items')
                .getFullList<ItemRecord>({
                    filter: latestAction.data!.items_list.map(id => `id="${id}"`).join('||'),
                }),
        queryKey: ['items'],
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
        <Dialog.Root lazyMount unmountOnExit size="xl">
            <Dialog.Trigger asChild>
                <Button colorPalette="{colors.purple}" hoverColorPalette="{colors.purple.hover}">
                    <LuShoppingCart />
                    Магаз
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content alignItems="center" my={0}>
                        <Box position="relative" w="70vw">
                            <Image src={ShopImage} position="absolute" draggable={false} w="full" />
                            <Grid
                                templateColumns="repeat(3, 1fr)"
                                gapX={4}
                                gapY={3}
                                position="absolute"
                                w="full"
                                pr="20%"
                                pt="8%"
                            >
                                <For each={latestAction.data.items_list}>
                                    {(itemId, index) => (
                                        <GridItem key={`${itemId}_${index}`}>
                                            <Item
                                                item={shopItems.get(itemId)!}
                                                imageHeight="11vw"
                                            />
                                        </GridItem>
                                    )}
                                </For>
                            </Grid>
                        </Box>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
