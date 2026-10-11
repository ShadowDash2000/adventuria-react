import { defineConfig } from '@chakra-ui/react';
import { adventuria3Recipes, adventuria3SlotRecipes } from '../adventuria-3/theme';
import { buttonRecipe } from './recipes/button.recipe';

export const adventuria4Config = defineConfig({
    theme: {
        recipes: { ...adventuria3Recipes, 'adventuria-button': buttonRecipe },
        slotRecipes: adventuria3SlotRecipes,
    },
});
