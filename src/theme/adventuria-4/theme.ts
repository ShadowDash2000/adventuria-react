import { defineConfig } from '@chakra-ui/react';
import { adventuria3Recipes, adventuria3SlotRecipes } from '../adventuria-3/theme';
import { buttonRecipe } from './recipes/button.recipe';
import { cardRecipe } from './recipes/card.recipe';
import { coverRecipe } from './recipes/cover.recipe';
import { dialogRecipe } from './recipes/dialog.recipe';

export const adventuria4Config = defineConfig({
    theme: {
        recipes: {
            ...adventuria3Recipes,
            adventuriaButton: buttonRecipe,
            adventuriaCover: coverRecipe,
        },
        slotRecipes: { ...adventuria3SlotRecipes, card: cardRecipe, dialog: dialogRecipe },
    },
});
