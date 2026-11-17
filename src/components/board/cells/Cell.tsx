import './cell.css';
import { Box, type BoxProps, Image } from '@chakra-ui/react';

interface CellProps extends BoxProps {
    iconUrl: string;
    width: number | string;
    height: number | string;
}

export const Cell = ({ iconUrl, width, height, ...rest }: CellProps) => {
    return (
        <Box position="relative" width={width} height={height} {...rest}>
            <Image src={iconUrl} width="100%" height="100%" />
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
