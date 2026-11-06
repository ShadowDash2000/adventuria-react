import { type ReactNode, useEffect, useState } from 'react';
import { useWheelDialogStore, WheelType } from './useWheelDialogStore';
import { useRollWheelStore } from './useRollWheelStore';
import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { invalidateAllActions } from '@shared/query';
import { Content as ActivitiesContent } from './activities/Content';
import { Content as ItemsContent } from './items/Content';
import { Content as ItemsOnCellContent } from './items-on-cell/Content';

const wheelsContent: Record<WheelType, ReactNode> = {
    activities: <ActivitiesContent />,
    items: <ItemsContent />,
    'items-on-cell': <ItemsOnCellContent />,
};

export const WheelDialog = () => {
    const { activeWheel, setActiveWheel } = useWheelDialogStore();
    const { isSpinning } = useRollWheelStore();
    const [wasSpinned, setWasSpinned] = useState(false);
    const activeWheelContent = activeWheel ? wheelsContent[activeWheel] : null;

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
            open={!!activeWheel}
            onOpenChange={async e => {
                if (isSpinning) return;

                if (!e.open) {
                    setActiveWheel(null);
                    if (wasSpinned) {
                        await invalidateAllActions();
                        setWasSpinned(false);
                    }
                }
            }}
            size="full"
        >
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            {activeWheelContent}
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
