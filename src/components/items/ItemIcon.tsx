import { Image, type ImageProps } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { MotionBox } from '@shared/components/MotionBox';
import { useItemsStore } from '@components/items/useItemsStore';
import type { RecordIdString } from '@shared/types/pocketbase';

interface ItemIconProps extends ImageProps {
    itemId: RecordIdString;
    description?: string;
}

export const ItemIcon = ({ itemId, description, ...rest }: ItemIconProps) => {
    const openItemDetails = useItemsStore(state => state.openItemDetails);
    const tooltipContent = description ? (
        <div dangerouslySetInnerHTML={{ __html: description }} />
    ) : undefined;

    return (
        <Tooltip
            content={tooltipContent}
            contentProps={{ fontSize: 'lg' }}
            disabled={!description}
            openDelay={100}
        >
            <MotionBox whileHover={{ scale: 1.1 }}>
                <Image
                    w="full"
                    h="full"
                    {...rest}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => openItemDetails(itemId)}
                />
            </MotionBox>
        </Tooltip>
    );
};
