import { defineSlotRecipe } from '@chakra-ui/react';

export const cardRecipe = defineSlotRecipe({
    className: 'card',
    slots: ['root', 'body', 'description'],
    base: {
        root: { color: 'transparent', bgColor: 'transparent !important', border: 'none' },
        body: { color: 'fg' },
        description: { color: 'fg' },
    },
});
