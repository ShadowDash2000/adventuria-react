import { Dialog, Portal } from '@chakra-ui/react';
import { LuShoppingCart } from 'react-icons/lu';
import { Content } from './Content';
import { Button } from '@theme/button';

export const Modal = () => {
    return (
        <Dialog.Root variant="transparent" lazyMount unmountOnExit size="xl">
            <Dialog.Trigger asChild>
                <Button colorPalette="purple">
                    <LuShoppingCart />
                    Магаз
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content alignItems="center" my={0}>
                        <Content />
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
