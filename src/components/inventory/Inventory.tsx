import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { For, Grid, Spinner, Text } from '@chakra-ui/react';
import { InventoryItem } from './InventoryItem';
import { type RecordIdString } from '@shared/types/pocketbase';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';

interface InventoryProps {
    userId: RecordIdString;
}

export const Inventory = ({ userId }: InventoryProps) => {
    const { pb, isAuth, user } = useAppContext();
    const inventory = useQuery({
        queryFn: () => {
            return pb
                .collection('inventory')
                .getFullList<InventoryItemRecord>({
                    filter: `user = "${userId}"`,
                    expand: 'item,item.effects',
                });
        },
        queryKey: ['inventory', userId],
    });

    if (inventory.isPending) return <Spinner />;
    if (inventory.isError) return <Text>Error: {inventory.error?.message}</Text>;
    if (inventory.data.length === 0) return <Text>Пусто</Text>;

    return (
        <Grid templateColumns="repeat(2, 1fr)">
            <For each={inventory.data}>
                {(inv, index) => (
                    <InventoryItem
                        key={index}
                        invItem={inv}
                        showControlButtons={isAuth && user.id === userId}
                    />
                )}
            </For>
        </Grid>
    );
};
