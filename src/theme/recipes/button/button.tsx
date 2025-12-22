import {
    createRecipeContext,
    type HTMLChakraProps,
    type RecipeVariantProps,
} from '@chakra-ui/react';
import { buttonRecipe } from './button.recipe';

const { withContext } = createRecipeContext({ recipe: buttonRecipe });

type ButtonProps = HTMLChakraProps<'button', RecipeVariantProps<typeof buttonRecipe>>;

export const Button = withContext<HTMLButtonElement, ButtonProps>('button');
