import { ItemTypeInfo, type ItemRecord } from '@shared/types/item';
import { VStack, Text, HStack } from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import { ItemIcon } from '@components/items/ItemIcon';
import { useAppContext } from '@context/AppContext';
import { ItemContextMenu } from '@components/debug/item-context-menu/Menu';

interface GlossaryItemProps {
    item: ItemRecord;
}

export const GlossaryItem = ({ item }: GlossaryItemProps) => {
    const { pb } = useAppContext();

    return (
        <VStack>
            <ItemContextMenu itemId={item.id}>
                <ItemIcon
                    itemId={item.id}
                    description={item.description}
                    src={pb.files.getURL(item, item.icon)}
                />
            </ItemContextMenu>
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
