import { defineSlotRecipe } from '@chakra-ui/react';

export const tableRecipe = defineSlotRecipe({
    className: 'table',
    slots: ['cell', 'columnHeader'],
    base: {
        cell: { borderColor: 'border.inverted' },
        columnHeader: { borderColor: 'border.inverted' },
    },
});
