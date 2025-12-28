import { Dialog, Portal, CloseButton } from '@chakra-ui/react';
import { CellInfo } from './CellInfo';
import type { ReactNode } from 'react';
import { useCellsStore } from '@components/board/useCellsStore';

type CellInfoProps = { children?: ReactNode };

export const CellInfoModal = ({ children }: CellInfoProps) => {
    const { selectedCellId, isModalOpen, closeCellInfo } = useCellsStore();

    return (
        <Dialog.Root
            open={isModalOpen}
            onOpenChange={e => !e.open && closeCellInfo()}
            scrollBehavior="inside"
            lazyMount
            unmountOnExit
        >
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        {selectedCellId && <CellInfo cellId={selectedCellId} />}
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
