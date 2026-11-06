import { Dialog, CloseButton, IconButton, Portal } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { FaBug } from 'react-icons/fa';
import { Content } from './Content';
import { useAppAuthContext } from '@context/AppContext';

export const DebugDialogIconButton = () => {
    const { isAuth, gameState, isGameStateSuccess } = useAppAuthContext();

    if (!isAuth || !isGameStateSuccess) {
        return null;
    }

    if (!gameState.debug) {
        return null;
    }

    return (
        <Dialog.Root size="sm" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip content="Дебаг">
                <Dialog.Trigger asChild>
                    <IconButton>
                        <FaBug />
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Дебаг</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" overflow="hidden">
                            <Content />
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
