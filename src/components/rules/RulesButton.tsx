import { CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { DialogContent } from '@ui/dialog-content';
import { FaGavel } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { RulesContent } from './RulesContent';

export const RulesButton = () => {
    return (
        <Dialog.Root size="xl" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Правила">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaGavel />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <DialogContent>
                        <Dialog.Header>
                            <Dialog.Title>Правила</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <RulesContent />
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
