import { Box, CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { FaTrophy } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { LeaderboardContent } from './LeaderboardContent';

export const LeaderboardButton = () => {
    return (
        <Dialog.Root size="xl" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Таблица лидеров">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaTrophy />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Таблица лидеров</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" overflow="hidden">
                            <Box overflowY="scroll" w="full">
                                <LeaderboardContent w="full" />
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
