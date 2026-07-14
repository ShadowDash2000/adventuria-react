import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import type { ItemView } from '@components/actions/roll-wheel/items-wheel/view';

interface WheelItemInfoProps {
    item: ItemView;
}

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
