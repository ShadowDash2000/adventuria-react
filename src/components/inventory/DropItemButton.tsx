import { Button } from '@theme/button';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { invalidateInventory, invalidateUser } from '@shared/queryClient';
import { useAppAuthContext } from '@context/AppContext';
import { ButtonGroup, CloseButton, Dialog, Portal, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Coin } from '@shared/components/Coin';

interface DropItemButtonProps {
    canDrop: boolean;
    invItem: InventoryItemRecord;
    onItemDrop?: () => void;
}

export const DropItemButton = ({ canDrop, invItem, onItemDrop }: DropItemButtonProps) => {
    const { pb, user } = useAppAuthContext();
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleDrop = async () => {
        try {
            await itemDropRequest(pb.authStore.token, invItem.id);
            await invalidateInventory(user.id);
            await invalidateUser();
            onItemDrop?.();
        } catch (e) {
            console.error(e);
        }
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
                                    colorPalette="green"
                                    onClick={async () => {
                                        await handleDrop();
                                        setOpenConfirm(false);
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

const itemDropRequest = async (authToken: string, itemId: RecordIdString) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/drop-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: itemId }),
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to drop item`);
    }
};
