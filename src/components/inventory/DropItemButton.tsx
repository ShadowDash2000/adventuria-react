import { Button } from '@theme/button';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import {
    invalidateInventory,
    invalidatePlayerProgress,
    invalidatePlayerProgressAuth,
} from '@shared/queryClient';
import { useAppAuthContext } from '@context/AppContext';
import { ButtonGroup, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Coin } from '@shared/components/Coin';
import { handleApiResponse } from '@shared/helpers/api';

interface DropItemButtonProps {
    canDrop: boolean;
    invItem: InventoryItemRecord;
    onItemDrop?: () => void;
}

export const DropItemButton = ({ canDrop, invItem, onItemDrop }: DropItemButtonProps) => {
    const { pb, player } = useAppAuthContext();
    const [openConfirm, setOpenConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDrop = async () => {
        const res = await dropItemRequest(pb.authStore.token, invItem.id);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateInventory(player.id);
        await invalidatePlayerProgressAuth();
        await invalidatePlayerProgress(player.id);
        onItemDrop?.();
    };

    return (
        <Dialog.Root
            open={openConfirm}
            onOpenChange={e => setOpenConfirm(e.open)}
            lazyMount
            unmountOnExit
        >
            <Dialog.Trigger asChild>
                <Button disabled={!canDrop} colorPalette="red">
                    Выбросить
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Вы уверены, что хотите выбросить предмет?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" flexDir="column" gap={4}>
                            {invItem.expand?.item && invItem.expand.item.price > 0 && (
                                <Text>
                                    За дроп этого предмета вы получите{' '}
                                    {Math.trunc(invItem.expand.item.price / 2)}{' '}
                                    <Coin w={6} display="inline-block" />
                                </Text>
                            )}
                            <ButtonGroup>
                                <Button colorPalette="red" onClick={() => setOpenConfirm(false)}>
                                    Отмена
                                </Button>
                                <Button
                                    loading={loading}
                                    colorPalette="green"
                                    onClick={async () => {
                                        try {
                                            setLoading(true);
                                            await handleDrop();
                                            setOpenConfirm(false);
                                        } catch (e) {
                                            console.error(e);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >
                                    Подтвердить
                                </Button>
                            </ButtonGroup>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

type DropItemSuccess = { success: true; message?: string; error?: never };

type DropItemError = { success: false; message: string; error: string };

type DropItemResult = DropItemSuccess | DropItemError;

const dropItemRequest = async (authToken: string, itemId: RecordIdString) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/drop-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
    });

    return (await res.json()) as DropItemResult;
};
