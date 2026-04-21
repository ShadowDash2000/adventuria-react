import { LuFerrisWheel } from 'react-icons/lu';
import { CloseButton, Dialog, IconButton, Portal, Spinner } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useState } from 'react';
import { useAppAuthContext } from '@context/AppContext';
import { ItemsWheelContent } from './ItemWheelContent';
import { useRollWheelStore } from '../useRollWheelStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';

export const ItemsWheelModal = () => {
    const { playerProgress, isPlayerProgressSuccess, availableActions } = useAppAuthContext();
    const [open, setOpen] = useState(false);
    const isSpinning = useRollWheelStore(state => state.isSpinning);
    const isRolling = useRollDiceStore(state => state.isRolling);

    if (!isPlayerProgressSuccess) return <Spinner />;

    return (
        <Dialog.Root
            variant="transparent"
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
                        w="full"
                        flexDir="column"
                        gap={0}
                        disabled={
                            playerProgress.item_wheels_count === 0 ||
                            !availableActions.includes('rollItem') ||
                            isSpinning ||
                            isRolling
                        }
                        colorPalette="{colors.purple}"
                        _hover={{ bg: '{colors.purple.hover}' }}
                    >
                        <LuFerrisWheel />x{playerProgress.item_wheels_count}
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
