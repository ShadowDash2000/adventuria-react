import { Button as ChakraButton, ButtonProps as ChakraButtonProps, chakra } from '@chakra-ui/react';
import type { FC } from 'react';

const CustomButton = chakra(ChakraButton, {
    base: {
        border: 0,
        borderImage:
            'linear-gradient(to right, transparent , rgba(255, 255, 255, 0.2), transparent)',
        borderImageSlice: 1,
        textTransform: 'uppercase',
        borderTop: '{spacing.1} solid',
        borderBottom: '{spacing.1} solid',
        textShadow: '{spacing.0.5} {spacing.0.5} black',
        fontSize: 'xl',
        color: 'white',
        fontWeight: 'bold',
        px: '{spacing.10}',
        bg: '-webkit-linear-gradient(left, transparent, #AEAFAE, transparent)',
    },
});

interface ButtonProps extends ChakraButtonProps {
    hoverColorPalette?: string;
}

export const Button: FC<ButtonProps> = ({
    colorPalette = '#AEAFAE',
    hoverColorPalette = 'lightgrey',
    children,
    ...props
}) => {
    return (
        <CustomButton
            bg={`-webkit-linear-gradient(left, transparent, ${colorPalette}, transparent)`}
            _hover={{
                bg: `-webkit-linear-gradient(left, transparent, ${hoverColorPalette}, transparent)`,
            }}
            {...props}
        >
            {children}
        </CustomButton>
    );
};
