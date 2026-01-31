import { ItemTypeInfo, type ItemRecord } from '@shared/types/item';
import { Image, VStack, Text, HStack } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { Coin } from '@shared/components/Coin';
import { GlossaryItemDetailModal } from './GlossaryItemDetailModal';

interface GlossaryItemProps {
    item: ItemRecord;
}

export const GlossaryItem = ({ item }: GlossaryItemProps) => {
    const { pb } = useAppContext();
    const icon = pb.files.getURL(item, item.icon);

    return (
        <VStack>
            <GlossaryItemDetailModal item={item}>
                <Image src={icon} width="100%" height="100%" _hover={{ cursor: 'pointer' }} />
            </GlossaryItemDetailModal>
            <HStack>
                <Text>{item.name}</Text>
                <Text color={ItemTypeInfo[item.type].color}>({ItemTypeInfo[item.type].label})</Text>
            </HStack>
            <HStack>
                <Text userSelect="none">{item.price > 0 ? item.price : 'Не продается'}</Text>
                <Coin w={6} />
            </HStack>
        </VStack>
    );
};
