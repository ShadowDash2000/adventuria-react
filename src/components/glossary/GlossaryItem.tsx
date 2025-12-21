import type { ItemRecord } from '@shared/types/item';
import { Image, VStack, Text, HStack } from '@chakra-ui/react';
import parse from 'html-react-parser';
import { Tooltip } from '@ui/tooltip';
import { useAppContext } from '@context/AppContext';
import { Coin } from '@shared/components/Coin';

interface GlossaryItemProps {
    item: ItemRecord;
}

export const GlossaryItem = ({ item }: GlossaryItemProps) => {
    const { pb } = useAppContext();
    const icon = pb.files.getURL(item, item.icon);

    return (
        <VStack>
            <Tooltip
                content={parse(item.description)}
                contentProps={{ fontSize: 'lg' }}
                disabled={!item.description}
                openDelay={100}
            >
                <Image src={icon} width="100%" height="100%" />
            </Tooltip>
            <Text>{item.name}</Text>
            <HStack>
                <Text userSelect="none">{item.price > 0 ? item.price : 'Не продается'}</Text>
                <Coin w={6} />
            </HStack>
        </VStack>
    );
};
