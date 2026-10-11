import { defineRecipe } from '@chakra-ui/react';

export const buttonRecipe = defineRecipe({
    className: 'adventuria-button',
    base: {
        display: 'inline-flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '{spacing.2}',
        py: '{spacing.1}',
        px: '{spacing.10}',
        h: 10,
        border: 0,
        textTransform: 'uppercase',
        textShadow: '{spacing.0.5} {spacing.0.5} black',
        fontSize: 'xl',
        color: 'fg',
        fontWeight: 'bold',
        '--btn-bg': '#AEAFAE',
        bgColor: 'var(--btn-bg)',
        _hover: { '--btn-bg': 'lightgrey' },

        cursor: 'pointer',
        userSelect: 'none',
        '&:is(:disabled, [disabled], [data-disabled], [aria-disabled=true])': {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
    },
    variants: {
        colorPalette: {
            red: { '--btn-bg': 'colors.red', _hover: { '--btn-bg': 'colors.red.hover' } },
            blue: { '--btn-bg': 'colors.blue', _hover: { '--btn-bg': 'colors.blue.hover' } },
            green: { '--btn-bg': 'colors.green', _hover: { '--btn-bg': 'colors.green.hover' } },
            orange: { '--btn-bg': 'colors.orange', _hover: { '--btn-bg': 'colors.orange.hover' } },
            purple: { '--btn-bg': 'colors.purple', _hover: { '--btn-bg': 'colors.purple.hover' } },
        },
        size: { sm: { px: '{spacing.8}', h: 8, fontSize: 'sm' } },
    },
});
