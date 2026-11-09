import { defineRecipe } from '@chakra-ui/react';

export const coverRecipe = defineRecipe({
    className: 'adventuriaCover',
    defaultVariants: { variant: 'default' },
    base: { aspectRatio: '3/4', objectFit: 'cover' },
    variants: { variant: { default: {}, action: {} } },
});
