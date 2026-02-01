import { type ItemRecord, ItemTypeInfo } from '@shared/types/item';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import { Dialog, Flex, HStack, Image, Spinner, Text } from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import parse from 'html-react-parser';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';

interface ItemDetailsContentProps {
    itemId: RecordIdString;
}

export const ItemDetailsContent = ({ itemId }: ItemDetailsContentProps) => {
    const { pb } = useAppContext();

    const {
        data: item,
        isPending,
        isError,
        error,
    } = useQuery({
        queryFn: () => pb.collection('items').getOne<ItemRecord>(itemId),
        queryKey: queryKeys.item(itemId),
        refetchOnWindowFocus: false,
    });

    if (isPending) {
        return (
            <Flex justify="center" p={6}>
                <Spinner />
            </Flex>
        );
    }

    if (isError) {
        const e = error as ClientResponseError;
        return <Text>Не удалось загрузить информацию о предмете: {e.message}</Text>;
    }

    const icon = pb.files.getURL(item, item.icon);

    return (
        <>
            <Dialog.Header>
                <Dialog.Title>
                    <Text>{item.name}</Text>
                    <Text color={ItemTypeInfo[item.type].color}>
                        ({ItemTypeInfo[item.type].label})
                    </Text>
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" flexDir="column" alignItems="center" gap={4}>
                <Image src={icon} width="100%" height="100%" />
                <HStack>
                    <Text userSelect="none">{item.price > 0 ? item.price : 'Не продается'}</Text>
                    <Coin w={6} />
                </HStack>
                <Text>{parse(item.description)}</Text>
            </Dialog.Body>
        </>
    );
};
