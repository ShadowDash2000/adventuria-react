import { defineSlotRecipe } from '@chakra-ui/react';

export const popoverRecipe = defineSlotRecipe({
    className: 'popover',
    slots: ['content'],
    base: { content: { bg: 'bg.inverted', color: 'fg.inverted' } },
});
