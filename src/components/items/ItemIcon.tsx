import parse from 'html-react-parser';
import { Image, type ImageProps } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { MotionBox } from '@shared/components/MotionBox';
import { useAppContext } from '@context/AppContext';
import { useItemsStore } from '@components/items/useItemsStore';
import type { ItemRecord } from '@shared/types/item';

interface ItemIconProps extends ImageProps {
    item: ItemRecord;
}

export const ItemIcon = ({ item, ...rest }: ItemIconProps) => {
    const { pb } = useAppContext();
    const openItemDetails = useItemsStore(state => state.openItemDetails);
    const icon = pb.files.getURL(item, item.icon);

    return (
        <Tooltip
            content={parse(item.description)}
            contentProps={{ fontSize: 'lg' }}
            disabled={!item.description}
            openDelay={100}
        >
            <MotionBox whileHover={{ scale: 1.1 }}>
                <Image
                    w="full"
                    h="full"
                    {...rest}
                    src={icon}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => openItemDetails(item.id)}
                />
            </MotionBox>
        </Tooltip>
    );
};
