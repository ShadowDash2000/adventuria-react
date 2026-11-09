import { defineSlotRecipe } from '@chakra-ui/react';

export const cardRecipe = defineSlotRecipe({
    className: 'card',
    slots: ['root', 'body', 'description'],
    base: {
        root: { '--border-accent-color': '#AEAFAE', '--bg-accent-color': '#AEAFAE' },
        body: { color: 'fg' },
        description: { color: 'fg' },
    },
    defaultVariants: { variant: 'transparent' },
    variants: {
        variant: {
            transparent: {
                root: { color: 'transparent', bgColor: 'transparent !important', border: 'none' },
            },
            solid: {
                root: {
                    bgImage:
                        'linear-gradient(0deg, var(--bg-accent-color) 0%, rgba(0, 0, 0, 0.5) 100%)',
                    borderRadius: '4xl',
                    boxShadow: '0px 6px 0px 8px var(--border-accent-color)',
                    _notLast: { mb: 4 },
                    '@media (max-width: 1660px)': { maxW: '95%' },
                },
            },
        },
        colorPalette: {
            red: {
                root: {
                    '--border-accent-color': 'colors.red',
                    '--bg-accent-color': 'rgba(255, 0, 0, 0.5)',
                },
            },
            blue: {
                root: {
                    '--border-accent-color': 'colors.blue',
                    '--bg-accent-color': 'rgba(0, 102, 255, 0.5)',
                },
            },
            green: {
                root: {
                    '--border-accent-color': 'colors.green',
                    '--bg-accent-color': 'rgba(0, 255, 102, 0.5)',
                },
            },
            orange: {
                root: {
                    '--border-accent-color': 'colors.orange',
                    '--bg-accent-color': 'rgba(255, 136, 0, 0.5)',
                },
            },
            purple: {
                root: {
                    '--border-accent-color': 'colors.purple',
                    '--bg-accent-color': 'rgba(140, 0, 255, 0.5)',
                },
            },
        },
    },
});
