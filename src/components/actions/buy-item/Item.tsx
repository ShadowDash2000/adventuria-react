import type { ItemRecord } from '@shared/types/item';
import { Image, VStack, Text, Icon, ImageProps } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { Button } from '@ui/button';
import { PiCoinVerticalFill } from 'react-icons/pi';
import { Tooltip } from '@ui/tooltip';
import type { RecordIdString } from '@shared/types/pocketbase';
import { invalidateAvailableActions, invalidateLatestAction } from '@shared/queryClient';

interface ItemProps {
    item: ItemRecord;
    imageHeight?: string;
    imageWidth?: string;
}

export const Item = ({ item, imageWidth, imageHeight }: ItemProps) => {
    const { pb, user } = useAppAuthContext();
    const icon = pb.files.getURL(item, item.icon);

    const handleBuy = async () => {
        try {
            await buyItemRequest(pb.authStore.token, item.id);
            await invalidateAvailableActions();
            await invalidateLatestAction();
        } catch (e) {
            console.error(e);
        }
    };

    const imageProps: ImageProps = {
        src: icon,
        w: imageWidth,
        h: imageHeight,
        transform: 'rotate(-20deg)',
    };

    return (
        <VStack>
            {item.description ? (
                <Tooltip content={<div dangerouslySetInnerHTML={{ __html: item.description }} />}>
                    <Image {...imageProps} />
                </Tooltip>
            ) : (
                <Image {...imageProps} />
            )}
            <Text color="black" fontSize="1.2vw">
                {item.name}
            </Text>
            <Button
                colorPalette="#87ad3c"
                hoverColorPalette="#9fcb49"
                disabled={user.balance < item.price}
                onClick={handleBuy}
            >
                Купить {item.price}
                <Icon size="xl" color="yellow.400">
                    <PiCoinVerticalFill />
                </Icon>
            </Button>
        </VStack>
    );
};

type BuyItemSuccess = { success: true; error?: never };

type BuyItemError = { success: false; error: string };

type BuyItemResult = BuyItemSuccess | BuyItemError;

const buyItemRequest = async (authToken: string, itemId: RecordIdString) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/buy-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to perform action`);
    }

    return (await res.json()) as BuyItemResult;
};
