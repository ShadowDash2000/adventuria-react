import { defineSlotRecipe } from '@chakra-ui/react';

export const dialogRecipe = defineSlotRecipe({
    className: 'dialog',
    slots: ['content'],
    base: {},
    defaultVariants: { variant: 'solid' },
    variants: {
        variant: {
            transparent: { content: { bg: 'none' } },
            solid: {
                content: {
                    bgImage: 'linear-gradient(0deg, #000000 0%, #192e55 50%)',
                    borderRadius: '4xl',
                    boxShadow: '0px 6px 0px 8px #192e55',
                },
            },
            cell: {
                content: {
                    bgImage:
                        'linear-gradient(0deg, #000000 0%, var(--dialog-cell-accent, #192e55) 50%)',
                    borderRadius: '4xl',
                    boxShadow: '0px 6px 0px 8px var(--dialog-cell-accent, #192e55)',
                },
            },
        },
    },
});
