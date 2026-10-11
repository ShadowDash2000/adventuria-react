import { defineConfig } from '@chakra-ui/react';
import { popoverRecipe } from './recipes/popover.recipe';
import { drawerRecipe } from './recipes/drawer.recipe';
import { cardRecipe } from './recipes/card.recipe';
import { dialogRecipe } from './recipes/dialog.recipe';
import { tableRecipe } from './recipes/table.recipe';
import { segmentGroupRecipe } from './recipes/segment-group.recipe';
import { buttonRecipe } from './recipes/button.recipe';
import { flexRecipe } from './recipes/flex.recipe';

export const adventuria3Recipes = {
    'adventuria-button': buttonRecipe,
    'adventuria-flex': flexRecipe,
};

export const adventuria3SlotRecipes = {
    popover: popoverRecipe,
    drawer: drawerRecipe,
    card: cardRecipe,
    dialog: dialogRecipe,
    table: tableRecipe,
    segmentGroup: segmentGroupRecipe,
};

export const adventuria3Config = defineConfig({
    theme: { recipes: adventuria3Recipes, slotRecipes: adventuria3SlotRecipes },
});
