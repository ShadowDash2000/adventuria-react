import { type FC, useMemo } from 'react';
import { Box, Flex, FlexProps, Heading, Image } from '@chakra-ui/react';
import type { ItemRecord } from '@shared/types/item';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';

interface WheelItemInfoProps extends FlexProps {
    item: ItemRecord;
}

export const WheelItemInfo: FC<WheelItemInfoProps> = ({ item, ...props }) => {
    const { pb } = useAppContext();
    const icon = useMemo(() => pb.files.getURL(item, item.icon), [item.icon]);

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
