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
                    bgImage: 'linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))',
                    boxShadow: 'rgba(0, 0, 0, 0.3) 0 0 {spacing.1} {spacing.1} inset',
                    borderWidth: '{spacing.0.5}',
                    borderStyle: 'solid',
                    borderColor: 'rgb(198, 198, 198)',
                    borderRadius: 12,
                    _before: {
                        content: '""',
                        pointerEvents: 'none',
                        inset: 0,
                        position: 'absolute',
                        borderWidth: '{spacing.1}',
                        borderStyle: 'solid',
                        borderColor: 'border.inverted',
                        borderRadius: 10,
                    },
                },
            },
        },
    },
});
