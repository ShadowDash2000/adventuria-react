import { Box, Flex, FlexProps, Heading, Image } from '@chakra-ui/react';
import type { ItemRecord } from '@shared/types/item';
import { useAppContext } from '@context/AppContextProvider';

interface WheelItemInfoProps extends FlexProps {
    item: ItemRecord;
}

export const WheelItemInfo = ({ item, ...props }: WheelItemInfoProps) => {
    const { pb } = useAppContext();
    const icon = pb.files.getURL(item, item.icon);

    return (
        <Flex {...props}>
            <Flex direction="column" align="center">
                <Heading>{item.name}</Heading>
                <Image src={icon} />
            </Flex>
            <Box dangerouslySetInnerHTML={{ __html: item.description }} />
        </Flex>
    );
};
