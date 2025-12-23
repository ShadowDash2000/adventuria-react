import { Button } from '@theme/button';
import type { RecordIdString } from '@shared/types/pocketbase';
import { invalidateInventory } from '@shared/queryClient';
import { useAppAuthContext } from '@context/AppContext';
import { ButtonGroup, CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useState } from 'react';

interface DropItemButtonProps {
    invItemId: RecordIdString;
    onItemDrop?: () => void;
}

export const DropItemButton = ({ invItemId, onItemDrop }: DropItemButtonProps) => {
    const { pb, user } = useAppAuthContext();
    const [openConfirm, setOpenConfirm] = useState(false);

    const handleDrop = async () => {
        try {
            await itemDropRequest(pb.authStore.token, invItemId);
            await invalidateInventory(user.id);
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
                <Button colorPalette="red">Выбросить</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Вы уверены, что хотите выбросить предмет?</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
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
