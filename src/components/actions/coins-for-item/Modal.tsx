import { Dialog, Portal } from '@chakra-ui/react';
import { Button } from '@theme/button';
import { LuShoppingCart } from 'react-icons/lu';
import { Content } from '@components/actions/coins-for-item/Content';

export const Modal = () => {
    return (
        <Dialog.Root variant="transparent" lazyMount unmountOnExit size="xl">
            <Dialog.Trigger asChild>
                <Button colorPalette="orange">
                    <LuShoppingCart />
                    Сделка
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
