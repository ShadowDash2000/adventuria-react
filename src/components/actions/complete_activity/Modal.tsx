import { CloseButton, Dialog, Portal } from '@chakra-ui/react';
import { LuNotebookPen } from 'react-icons/lu';
import { Button } from '@theme/button';
import { Content } from '@components/actions/complete_activity/Content';

export const Modal = () => {
    return (
        <Dialog.Root lazyMount size="xl">
            <Dialog.Trigger asChild>
                <Button colorPalette="green">
                    <LuNotebookPen />
                    Завершить
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>I tried so hard... И дропнул кал!</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
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
