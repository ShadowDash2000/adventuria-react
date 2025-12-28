import { defineSlotRecipe } from '@chakra-ui/react';

export const segmentGroupRecipe = defineSlotRecipe({
    className: 'segment-group',
    slots: ['root', 'indicator', 'items', 'item', 'item-text'],
    base: {
        root: {
            position: 'relative',
            bgImage: 'linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0 0 {spacing.1} {spacing.1} inset',
            border: '{spacing.0.5} solid rgb(198, 198, 198)',
            borderRadius: 12,
            overflow: 'auto',
        },
        indicator: { bg: '{colors.blue}' },
    },
});
