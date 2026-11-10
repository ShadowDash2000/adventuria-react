import type { RecordIdString } from '@shared/types/pocketbase';
import { CloseButton, Drawer, For, Grid, HStack, Spinner, Text } from '@chakra-ui/react';
import { InventoryItem } from './InventoryItem';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';
import { Coin } from '@shared/components/Coin';

interface InventoryProps {
    playerId: RecordIdString;
}

export const Inventory = ({ playerId: invPlayerId }: InventoryProps) => {
    const { isAuth, playerId } = useAppContext();

    const inventory = useQuery({
        queryFn: async () => {
            const res = await getPlayerInventoryView(invPlayerId);

            if (!res.success) {
                throw new Error(res.message);
            }

            res.data.items = res.data.items.map(item => ({
                ...item,
                icon: new URL(item.icon, import.meta.env.VITE_PB_URL).href,
            }));

            return res.data;
        },
        refetchOnWindowFocus: false,
        queryKey: queryKeys.inventory(invPlayerId),
    });

    if (inventory.isPending) {
        return <Spinner />;
    }

    if (inventory.isError) {
        return <Text>Error: {inventory.error?.message}</Text>;
    }

    return (
        <>
            <Drawer.Header fontSize="xl" justifyContent="space-between">
                {inventory.data.player_name}
            </Drawer.Header>
            <Drawer.Body>
                <Grid templateColumns="repeat(2, 1fr)">
                    <For each={inventory.data.items}>
                        {(item, index) => (
                            <InventoryItem
                                item={item}
                                key={index}
                                showControlButtons={isAuth && playerId === invPlayerId}
                            />
                        )}
                    </For>
                </Grid>
            </Drawer.Body>
            <Drawer.Footer justifyContent="space-between">
                <HStack>
                    <Text>{inventory.data.balance}</Text>
                    <Coin w={6} />
                </HStack>
                <Text>
                    {`${inventory.data.used_inventory_slots} / ${inventory.data.max_inventory_slots}`}{' '}
                    слотов
                </Text>
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
            </Drawer.CloseTrigger>
        </>
    );
};

export type PlayerInventoryItemEffectView = { id: RecordIdString; type: string };

export type PlayerInventoryItemView = {
    inventory_id: RecordIdString;
    item_id: RecordIdString;
    name: string;
    icon: string;
    description: string;
    is_active: boolean;
    can_drop: boolean;
    can_use: boolean;
    drop_price: number;
    unapplied_effects: PlayerInventoryItemEffectView[];
};

type PlayerInventoryViewData = {
    player_id: RecordIdString;
    player_name: string;
    balance: number;
    max_inventory_slots: number;
    used_inventory_slots: number;
    items: PlayerInventoryItemView[];
};

type PlayerInventoryViewSuccess = {
    success: true;
    data: PlayerInventoryViewData;
    message?: string;
    error?: never;
};

type PlayerInventoryViewError = { success: false; data: never; message: string; error: never };

type PlayerInventoryViewResult = PlayerInventoryViewSuccess | PlayerInventoryViewError;

const getPlayerInventoryView = async (playerId: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/inventory?playerId=${playerId}`, {
        method: 'GET',
    });

    return (await res.json()) as PlayerInventoryViewResult;
};
