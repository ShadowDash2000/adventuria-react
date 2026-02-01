import { ItemTypeInfo, type ItemRecord } from '@shared/types/item';
import { VStack, Text, HStack } from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import { ItemIcon } from '@components/items/ItemIcon';

interface GlossaryItemProps {
    item: ItemRecord;
}

export const GlossaryItem = ({ item }: GlossaryItemProps) => {
    return (
        <VStack>
            <ItemIcon item={item} />
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
