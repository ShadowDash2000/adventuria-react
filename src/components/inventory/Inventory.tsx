import type { InventoryItemRecord } from '@shared/types/inventory-item';
import type { UserRecord } from '@shared/types/user';
import { CloseButton, Drawer, For, Grid, HStack, Spinner, Text } from '@chakra-ui/react';
import { InventoryItem } from './InventoryItem';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Coin } from '@shared/components/Coin';

interface InventoryProps {
    user: UserRecord;
}

export const Inventory = ({ user: invUser }: InventoryProps) => {
    const { pb, isAuth, user } = useAppContext();

    const inventory = useQuery({
        queryFn: () => {
            return pb
                .collection('inventory')
                .getFullList<InventoryItemRecord>({
                    filter: `user = "${invUser.id}"`,
                    expand: 'item,item.effects',
                });
        },
        queryKey: queryKeys.inventory(invUser.id),
    });

    const userInventory = useQuery({
        queryFn: () => {
            return pb.collection('users').getOne<UserRecord>(invUser.id, { fields: 'balance' });
        },
        queryKey: queryKeys.user(invUser.id),
    });

    if (inventory.isPending) return <Spinner />;
    if (inventory.isError) return <Text>Error: {inventory.error?.message}</Text>;

    const itemsUsingSlot = inventory.data.filter(
        invItem => invItem.expand?.item.isUsingSlot,
    ).length;

    return (
        <>
            <Drawer.Header fontSize="xl" justifyContent="space-between">
                {invUser.name}
            </Drawer.Header>
            <Drawer.Body>
                <Grid templateColumns="repeat(2, 1fr)">
                    <For each={inventory.data}>
                        {(inv, index) => (
                            <InventoryItem
                                key={index}
                                invItem={inv}
                                showControlButtons={isAuth && user.id === invUser.id}
                            />
                        )}
                    </For>
                </Grid>
            </Drawer.Body>
            <Drawer.Footer justifyContent="space-between">
                <HStack>
                    {userInventory.isPending ? (
                        <Spinner />
                    ) : (
                        <Text>{userInventory.isSuccess ? userInventory.data.balance : 0}</Text>
                    )}
                    <Coin w={6} />
                </HStack>
                <Text>{`${itemsUsingSlot} / ${invUser.maxInventorySlots}`} слотов</Text>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
            </Drawer.CloseTrigger>
        </>
    );
};
