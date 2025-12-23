import {
    createRecipeContext,
    type HTMLChakraProps,
    type RecipeVariantProps,
    type ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';
import { buttonRecipe } from './button.recipe';
import { UnstyledButton } from './unstyled-button';

const { withContext } = createRecipeContext({ recipe: buttonRecipe });

type ButtonProps = HTMLChakraProps<'button', RecipeVariantProps<typeof buttonRecipe>> &
    ChakraButtonProps;

export const Button = withContext<HTMLButtonElement, ButtonProps>(UnstyledButton);
