import { Box, type BoxProps, Image } from '@chakra-ui/react';
import { CellRecord } from '@shared/types/cell';
import { useAppContext } from '@context/AppContextProvider';
import { CellTooltip } from './CellTooltip';
import { CellInfo } from './CellInfoModal';

interface CellProps extends BoxProps {
    cell: CellRecord;
    width: number | string;
    height: number | string;
}

export const Cell = ({ cell, width, height, ...rest }: CellProps) => {
    const { pb } = useAppContext();

    return (
        <Box position="relative" width={width} height={height} {...rest}>
            <CellInfo cell={cell}>
                <Box
                    top={0}
                    position="absolute"
                    borderWidth=".2vw"
                    borderColor={{ base: 'transparent', _hover: 'border.inverted' }}
                    width={width}
                    height={height}
                >
                    <CellTooltip cell={cell}>
                        <Image src={pb.files.getURL(cell, cell.icon)} width="100%" height="100%" />
                    </CellTooltip>
                </Box>
            </CellInfo>
        </Box>
    );
};
