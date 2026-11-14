import './cell.css';
import { Box, type BoxProps, Image } from '@chakra-ui/react';
import { CellRecord } from '@shared/types/cell';
import { useAppContext } from '@context/AppContext';

interface CellProps extends BoxProps {
    cell: CellRecord;
    width: number | string;
    height: number | string;
}

export const Cell = ({ cell, width, height, ...rest }: CellProps) => {
    const { pb } = useAppContext();
    const imgUrl = pb.files.getURL(cell, cell.icon, { thumb: '640x0' });

    return (
        <Box position="relative" width={width} height={height} {...rest}>
            <Image src={imgUrl} width="100%" height="100%" />
            <Box
                top={0}
                position="absolute"
                outlineWidth=".2vw"
                outlineOffset="-.3vw"
                outlineStyle="solid"
                outlineColor={{ base: 'transparent', _hover: 'border.inverted' }}
                width={width}
                height={height}
            />
        </Box>
    );
};
