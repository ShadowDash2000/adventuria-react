import type { InventoryItemRecord } from '@shared/types/inventory-item';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { CloseButton, Drawer, For, Grid, HStack, Spinner, Text } from '@chakra-ui/react';
import { InventoryItem } from './InventoryItem';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Coin } from '@shared/components/Coin';
import { inventorySchema, itemSchema, pbCollections, playerProgressSchema } from '@shared/pbSchema';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import { and, eq } from '@shared/pbFilter';

interface InventoryProps {
    player: PlayerRecord;
}

export const Inventory = ({ player: invPlayer }: InventoryProps) => {
    const { pb, isAuth, player, currentSeason, isCurrentSeasonSuccess } = useAppContext();

    const inventory = useQuery({
        queryFn: () => {
            return pb
                .collection(pbCollections.inventory)
                .getFullList<InventoryItemRecord>({
                    filter: `${inventorySchema.player} = "${invPlayer.id}"`,
                    expand: joinExpand(
                        inventorySchema.item,
                        dotExpand(inventorySchema.item, itemSchema.effects),
                    ),
                });
        },
        refetchOnWindowFocus: false,
        queryKey: queryKeys.inventory(invPlayer.id),
    });

    const playerProgress = useQuery({
        queryFn: () => {
            return pb
                .collection(pbCollections.playersProgress)
                .getFirstListItem<PlayerProgressRecord>(invPlayer.id, {
                    filter: and(
                        eq(playerProgressSchema.player, invPlayer.id),
                        eq(playerProgressSchema.season, currentSeason!),
                    ),
                    fields: joinExpand(
                        playerProgressSchema.balance,
                        playerProgressSchema.maxInventorySlots,
                    ),
                });
        },
        refetchOnWindowFocus: false,
        enabled: isCurrentSeasonSuccess,
        queryKey: [...queryKeys.playerProgress(invPlayer.id), 'inventory'],
    });

    if (inventory.isPending) return <Spinner />;
    if (inventory.isError) return <Text>Error: {inventory.error?.message}</Text>;

    const itemsUsingSlot = inventory.data.filter(
        invItem => invItem.expand?.item.is_using_slot,
    ).length;

    return (
        <>
            <Drawer.Header fontSize="xl" justifyContent="space-between">
                {invPlayer.name}
            </Drawer.Header>
            <Drawer.Body>
                <Grid templateColumns="repeat(2, 1fr)">
                    <For each={inventory.data}>
                        {(inv, index) => (
                            <InventoryItem
                                invItem={inv}
                                key={index}
                                showControlButtons={isAuth && player.id === invPlayer.id}
                            />
                        )}
                    </For>
                </Grid>
            </Drawer.Body>
            <Drawer.Footer justifyContent="space-between">
                <HStack>
                    {playerProgress.isPending ? (
                        <Spinner />
                    ) : (
                        <Text>{playerProgress.isSuccess ? playerProgress.data.balance : 0}</Text>
                    )}
                    <Coin w={6} />
                </HStack>
                {playerProgress.isPending ? (
                    <Spinner />
                ) : (
                    <Text>
                        {`${itemsUsingSlot} / ${playerProgress.isSuccess ? playerProgress.data.max_inventory_slots : 0}`}{' '}
                        слотов
                    </Text>
                )}
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
            </Drawer.CloseTrigger>
        </>
    );
};
