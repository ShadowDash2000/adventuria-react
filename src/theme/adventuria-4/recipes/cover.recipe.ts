import { defineRecipe } from '@chakra-ui/react';

export const coverRecipe = defineRecipe({
    className: 'adventuriaCover',
    defaultVariants: { variant: 'default' },
    base: { aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'xl', borderWidth: '{sizes.1}' },
    variants: {
        variant: {
            default: { cornerShape: 'rounded' },
            action: { borderColor: 'white', borderStyle: 'solid', cornerShape: 'notch' },
        },
    },
});
