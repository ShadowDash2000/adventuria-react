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

    return (
        <Box position="relative" width={width} height={height} {...rest}>
            <Box
                top={0}
                position="absolute"
                outlineWidth=".2vw"
                outlineOffset="-.3vw"
                outlineStyle="solid"
                outlineColor={{ base: 'transparent', _hover: 'border.inverted' }}
                width={width}
                height={height}
            >
                <Image
                    src={pb.files.getURL(cell, cell.icon, { thumb: '640x0' })}
                    width="100%"
                    height="100%"
                />
            </Box>
        </Box>
    );
};
