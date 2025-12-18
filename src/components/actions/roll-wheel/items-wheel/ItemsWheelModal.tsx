import { LuFerrisWheel } from 'react-icons/lu';
import { CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useState } from 'react';
import { useAppAuthContext } from '@context/AppContext';
import { ItemsWheelContent } from './ItemWheelContent';
import { useRollWheelStore } from '../useRollWheelStore';

export const ItemsWheelModal = () => {
    const { user } = useAppAuthContext();
    const [open, setOpen] = useState(false);
    const isSpinning = useRollWheelStore(state => state.isSpinning);

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={e => {
                if (!isSpinning) setOpen(e.open);
            }}
            size="full"
        >
            <Tooltip content="Колесо предметов">
                <Dialog.Trigger asChild>
                    <IconButton
                        disabled={user.itemWheelsCount === 0}
                        colorPalette="{colors.purple}"
                        _hover={{ bg: '{colors.purple.hover}' }}
                    >
                        <LuFerrisWheel />x{user.itemWheelsCount}
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            <ItemsWheelContent />
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
