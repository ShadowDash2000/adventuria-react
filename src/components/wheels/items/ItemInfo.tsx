import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import type { RecordIdString } from '@shared/types/pocketbase';

interface WheelItemInfoProps {
    item: Item;
}

type Item = {
    id: RecordIdString;
    collectionName: string;
    name: string;
    icon: string;
    description: string;
};

export const ItemInfo = ({ item }: WheelItemInfoProps) => {
    const { pb } = useAppContext();
    const icon = pb.files.getURL(item, item.icon);

    return (
        <>
            <Flex direction="column" align="center">
                <Heading textAlign="center">{item.name}</Heading>
                <Image src={icon} />
            </Flex>
            <Box dangerouslySetInnerHTML={{ __html: item.description }} />
        </>
    );
};
