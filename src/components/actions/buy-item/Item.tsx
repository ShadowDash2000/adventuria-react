import type { ItemRecord } from '@shared/types/item';
import { Image, VStack, Text, ImageProps, Float, Flex } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { Tooltip } from '@ui/tooltip';
import type { RecordIdString } from '@shared/types/pocketbase';
import {
    invalidateAvailableActions,
    invalidateLatestAction,
    invalidateShopItems,
    invalidateUser,
} from '@shared/queryClient';
import PriceBadgeImage from '@public/price-badge.png';
import { Coin } from '@shared/components/Coin';
import { useState } from 'react';

interface ItemProps {
    item: ItemRecord;
    imageHeight?: string;
    imageWidth?: string;
}

const IMAGE_ROTATION = 'rotate(-20deg)';
const BADGE_ROTATION = 'rotate(35deg)';

export const Item = ({ item, imageWidth, imageHeight }: ItemProps) => {
    const { pb } = useAppAuthContext();
    const icon = pb.files.getURL(item, item.icon);
    const [hovered, setHovered] = useState(false);

    const handleBuy = async () => {
        try {
            await buyItemRequest(pb.authStore.token, item.id);
            await invalidateAvailableActions();
            await invalidateLatestAction();
            await invalidateShopItems();
            await invalidateUser();
        } catch (e) {
            console.error(e);
        }
    };

    const imageProps: ImageProps = {
        src: icon,
        w: imageWidth,
        h: imageHeight,
        transform: IMAGE_ROTATION,
    };

    return (
        <Tooltip
            content={<div dangerouslySetInnerHTML={{ __html: item.description }} />}
            contentProps={{ fontSize: 'lg' }}
            disabled={!item.description}
            openDelay={100}
        >
            <VStack
                data-hovered={hovered}
                position="relative"
                _hover={{ cursor: 'pointer' }}
                css={{
                    '&[data-hovered="true"]': {
                        filter: 'brightness(1.1) drop-shadow(0 0 0.5rem black)',
                    },
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onClick={handleBuy}
            >
                <Image {...imageProps} />
                <Float translate="15% 50%">
                    <Image src={PriceBadgeImage} w="8vw" h="8vw" />
                    <Flex
                        transform={`translateX(1vw) translateY(0.5vw) ${BADGE_ROTATION}`}
                        position="absolute"
                        align="center"
                        gap={2}
                    >
                        <Text
                            color="white"
                            fontSize="1.5vw"
                            style={{ WebkitTextStroke: '0.05vw black' }}
                        >
                            {item.price}
                        </Text>
                        <Coin w="2vw" h="2vw" />
                    </Flex>
                </Float>
                <Text
                    position="absolute"
                    bottom={0}
                    color="white"
                    fontSize="1.2vw"
                    bg="black"
                    p={2}
                    borderRadius="0.3vw"
                    maxW="10vw"
                    textAlign="center"
                    lineHeight="0.8"
                >
                    {item.name}
                </Text>
            </VStack>
        </Tooltip>
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
