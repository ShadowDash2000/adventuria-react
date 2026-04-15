import { Box, CloseButton, Dialog, Link, type LinkProps, Portal } from '@chakra-ui/react';
import { EventStatsContent } from './EventStatsContent';

export const EventStatsButton = ({ ...props }: LinkProps) => {
    return (
        <Dialog.Root size="xl" scrollBehavior="inside" lazyMount unmountOnExit>
            <Dialog.Trigger asChild>
                <Link {...props}>Итоги ивента</Link>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Итоги ивента</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" overflow="hidden">
                            <Box overflowY="scroll" w="full">
                                <EventStatsContent w="full" mb={4} />
                            </Box>
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
