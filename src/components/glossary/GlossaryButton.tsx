import { CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { DialogContent } from '@ui/dialog-content';
import { FaBook } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { GlossaryContent } from './GlossaryContent';

export const GlossaryButton = () => {
    return (
        <Dialog.Root size="xl" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Глоссарий">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaBook />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <DialogContent>
                        <Dialog.Header>
                            <Dialog.Title>Глоссарий</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <GlossaryContent />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </DialogContent>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
