import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import type { ItemRecord } from '@shared/types/item';
import { useAppContext } from '@context/AppContext';

interface WheelItemInfoProps {
    item: ItemRecord;
}

export const WheelItemInfo = ({ item }: WheelItemInfoProps) => {
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
