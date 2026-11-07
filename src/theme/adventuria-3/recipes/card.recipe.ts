import { defineSlotRecipe } from '@chakra-ui/react';

export const cardRecipe = defineSlotRecipe({
    className: 'card',
    slots: ['root', 'body', 'description'],
    base: { body: { color: 'fg' }, description: { color: 'fg' } },
    defaultVariants: { variant: 'transparent' },
    variants: {
        variant: {
            transparent: {
                root: { color: 'transparent', bgColor: 'transparent !important', border: 'none' },
            },
            solid: {
                root: {
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
                        borderColor: 'white',
                        borderRadius: 10,
                    },
                },
            },
        },
    },
});
