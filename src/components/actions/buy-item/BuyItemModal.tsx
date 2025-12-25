import { Box, Dialog, Portal, Image } from '@chakra-ui/react';
import { LuShoppingCart } from 'react-icons/lu';
import { BuyItemContent } from './BuyItemContent';
import ShopImage from '@public/shop.gif';
import { Button } from '@theme/button';

export const BuyItemModal = () => {
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
                        <Box position="relative" w="70vw">
                            <Image src={ShopImage} position="absolute" draggable={false} w="full" />
                            <BuyItemContent />
                        </Box>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
