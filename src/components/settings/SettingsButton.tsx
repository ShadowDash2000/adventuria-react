import { CloseButton, Dialog, IconButton, Portal } from '@chakra-ui/react';
import { FaCog } from 'react-icons/fa';
import { Tooltip } from '@ui/tooltip';
import { SettingsContent } from './SettingsContent';

export const SettingsButton = () => {
    return (
        <Dialog.Root size="sm" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Настройки">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaCog />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Настройки</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" overflow="hidden">
                            <SettingsContent w="full" />
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
