import type { InventoryItemRecord } from '@shared/types/inventory-item';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { RecordIdString } from '@shared/types/pocketbase';
import { CloseButton, Drawer, For, Grid, HStack, Spinner, Text } from '@chakra-ui/react';
import { InventoryItem } from './InventoryItem';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Coin } from '@shared/components/Coin';
import {
    inventorySchema,
    itemSchema,
    pbCollections,
    playerProgressSchema,
    playerSchema,
} from '@shared/pbSchema';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import { and, eq } from '@shared/pbFilter';

interface InventoryProps {
    playerId: RecordIdString;
}

export const Inventory = ({ playerId: invPlayerId }: InventoryProps) => {
    const { pb, isAuth, playerId, gameState, isGameStateSuccess } = useAppContext();

    const inventory = useQuery({
        queryFn: () => {
            return pb
                .collection(pbCollections.inventory)
                .getFullList<InventoryItemRecord>({
                    filter: `${inventorySchema.player} = "${invPlayerId}"`,
                    expand: joinExpand(
                        inventorySchema.item,
                        dotExpand(inventorySchema.item, itemSchema.effects),
                    ),
                });
        },
        refetchOnWindowFocus: false,
        queryKey: queryKeys.inventory(invPlayerId),
    });

    const playerProgress = useQuery({
        queryFn: () => {
            return pb
                .collection(pbCollections.playersProgress)
                .getFirstListItem<PlayerProgressRecord>(invPlayerId, {
                    filter: and(
                        eq(playerProgressSchema.player, invPlayerId),
                        eq(playerProgressSchema.season, gameState!.season),
                    ),
                    fields: joinExpand(
                        playerProgressSchema.balance,
                        playerProgressSchema.maxInventorySlots,
                        dotExpand('expand', playerProgressSchema.player, playerSchema.name),
                    ),
                    expand: playerProgressSchema.player,
                });
        },
        refetchOnWindowFocus: false,
        enabled: isGameStateSuccess,
        queryKey: [...queryKeys.playerProgress(invPlayerId), 'inventory', gameState?.season],
    });

    if (inventory.isPending) return <Spinner />;
    if (inventory.isError) return <Text>Error: {inventory.error?.message}</Text>;

    const itemsUsingSlot = inventory.data.filter(
        invItem => invItem.expand?.item.is_using_slot,
    ).length;

    return (
        <>
            <Drawer.Header fontSize="xl" justifyContent="space-between">
                {playerProgress.isSuccess ? playerProgress.data.expand?.player.name : ''}
            </Drawer.Header>
            <Drawer.Body>
                <Grid templateColumns="repeat(2, 1fr)">
                    <For each={inventory.data}>
                        {(inv, index) => (
                            <InventoryItem
                                invItem={inv}
                                key={index}
                                showControlButtons={isAuth && playerId === invPlayerId}
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
