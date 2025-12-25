import { LuFerrisWheel } from 'react-icons/lu';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ActivitiesWheelContent } from './ActivitiesWheelContent';
import { useRollWheelStore } from '../useRollWheelStore';
import { invalidateAllActions } from '@shared/queryClient';
import { Button } from '@theme/button';

export const ActivitiesWheelModal = () => {
    const [open, setOpen] = useState(false);
    const [wasSpinned, setWasSpinned] = useState(false);
    const isSpinning = useRollWheelStore(state => state.isSpinning);

    useEffect(() => {
        if (isSpinning) {
            setWasSpinned(true);
        }
    }, [isSpinning]);

    return (
        <Dialog.Root
            variant="transparent"
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={async e => {
                if (!isSpinning) {
                    setOpen(e.open);
                    if (!e.open && wasSpinned) {
                        await invalidateAllActions();
                        setWasSpinned(false);
                    }
                }
            }}
            size="full"
        >
            <Dialog.Trigger asChild>
                <Button colorPalette="purple">
                    <LuFerrisWheel />
                    Колесо
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            <ActivitiesWheelContent />
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
