import { CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
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
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Глоссарий</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" overflow="hidden">
                            <GlossaryContent
                                w="full"
                                templateColumns={{
                                    base: 'repeat(3, 1fr)',
                                    lgDown: 'repeat(2, 1fr)',
                                    smDown: 'repeat(1, 1fr)',
                                }}
                                gapX={4}
                                overflow="hidden auto"
                            />
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
