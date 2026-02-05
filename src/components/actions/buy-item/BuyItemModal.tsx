import { Box, Dialog, Portal, Image, Spinner, Text } from '@chakra-ui/react';
import { LuShoppingCart } from 'react-icons/lu';
import { BuyItemContent } from './BuyItemContent';
import ShopImage from '@public/shop.gif';
import CasinoImage from '@public/shop-casino.png';
import { Button } from '@theme/button';
import { useAppAuthContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { latestActionQuery } from '@shared/queryClient';
import type { ClientResponseError } from 'pocketbase';

const bgImage: Record<string, string> = { shop: ShopImage, casino: CasinoImage };

export const BuyItemModal = () => {
    const { pb, user } = useAppAuthContext();
    const action = useQuery(latestActionQuery(pb, user.id, { expand: 'cell' }));

    if (action.isPending) {
        return <Spinner />;
    }

    if (action.isError) {
        const e = action.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    const cellType = action.data.expand?.cell?.type || 'shop';
    const image = bgImage[cellType];

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
                            <Image src={image} position="absolute" draggable={false} w="full" />
                            <BuyItemContent />
                        </Box>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
