import { defineSlotRecipe } from '@chakra-ui/react';

export const drawerRecipe = defineSlotRecipe({
    className: 'drawer',
    slots: [
        'root',
        'positioner',
        'backdrop',
        'content',
        'header',
        'body',
        'footer',
        'closeTrigger',
    ],
    base: {
        content: { bg: '{gradients.psone}', color: 'fg.inverted' },
        header: { color: 'fg' },
        body: { color: 'fg' },
        footer: { color: 'fg' },
    },
});
