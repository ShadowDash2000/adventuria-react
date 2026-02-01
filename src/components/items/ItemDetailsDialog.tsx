import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { ItemDetailsContent } from './ItemDetailsContent';
import { useItemsStore } from './useItemsStore';

export const ItemDetailsDialog = () => {
    const { selectedItemId, isDialogOpen, closeItemDetails } = useItemsStore();

    return (
        <Dialog.Root
            open={isDialogOpen}
            onOpenChange={e => !e.open && closeItemDetails()}
            scrollBehavior="inside"
            lazyMount
            unmountOnExit
        >
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        {selectedItemId && <ItemDetailsContent itemId={selectedItemId} />}
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
