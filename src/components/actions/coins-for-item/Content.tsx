import { Box, Image, Spinner, Text, VStack } from '@chakra-ui/react';
import ShopImage from '@public/shop.gif';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useQuery } from '@tanstack/react-query';
import { invalidateAvailableActions, invalidateGameState, queryKeys } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import { ItemIcon } from '@components/items/ItemIcon';
import { Button } from '@theme/button';
import { useState } from 'react';
import { handleApiResponse } from '@shared/helpers/api';

export const Content = () => {
    const { pb } = useAppContext();
    const [loading, setLoading] = useState(false);

    const dealView = useQuery({
        queryFn: async () => {
            const res = await getDealView(pb.authStore.token);

            if (!res.success) {
                throw new Error(res.message);
            }

            return res;
        },
        queryKey: [...queryKeys.coinsForItemView],
        refetchOnWindowFocus: false,
    });

    const handleDeal = async () => {
        const res = await dealRequest(pb.authStore.token);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateGameState();
        await invalidateAvailableActions();
    };

    if (dealView.isPending) {
        return <Spinner />;
    }

    if (dealView.isError) {
        return <Text color="red.500">{dealView.error.message}</Text>;
    }

    const item = dealView.data.data.item;

    return (
        <Box position="relative" w="70vw">
            <Image
                src={ShopImage}
                position="absolute"
                draggable={false}
                w="full"
                userSelect="none"
            />
            <VStack position="absolute" w="full">
                <VStack>
                    <ItemIcon
                        h="14vw"
                        itemId={item.id}
                        description={item.description}
                        src={pb.files.getURL(item, item.icon)}
                    />
                    <Text
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
                    <Button
                        loading={loading}
                        onClick={async () => {
                            try {
                                setLoading(true);
                                await handleDeal();
                            } catch (e) {
                                console.error(e);
                            } finally {
                                setLoading(false);
                            }
                        }}
                    >
                        Сделка
                    </Button>
                </VStack>
            </VStack>
        </Box>
    );
};

type ItemView = { id: RecordIdString; name: string; description: string; icon: string };

type GetDealViewData = { item: ItemView; coins: number };

type GetDealViewSuccess = { success: true; data: GetDealViewData; message?: string; error?: never };

type GetDealViewError = { success: false; data: never; message: string; error: never };

type GetDealViewResult = GetDealViewSuccess | GetDealViewError;

const getDealView = async (authToken: string) => {
    const res = await fetch(
        `${import.meta.env.VITE_PB_URL}/api/action-view?action=coins_for_item`,
        { method: 'GET', headers: { Authorization: `Bearer ${authToken}` } },
    );

    return (await res.json()) as GetDealViewResult;
};

type DealSuccess = { success: true; message?: string; error?: never };

type DealError = { success: false; message: string; error: string };

type DealResult = DealSuccess | DealError;

const dealRequest = async (authToken: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/coins-for-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
    });

    return (await res.json()) as DealResult;
};
