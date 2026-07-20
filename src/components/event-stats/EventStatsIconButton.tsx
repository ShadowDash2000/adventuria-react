import { Box, CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { EventStatsContent } from './EventStatsContent';
import { FaChartBar } from 'react-icons/fa';
import { Tooltip } from '@ui/tooltip';

export const EventStatsIconButton = () => {
    return (
        <Dialog.Root size="xl" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Статистика ивента">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaChartBar />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Статистика ивента</Dialog.Title>
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
