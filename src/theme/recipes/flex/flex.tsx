import {
    createRecipeContext,
    type HTMLChakraProps,
    type RecipeVariantProps,
    type FlexProps as ChakraFlexProps,
    Flex as ChakraFlex,
} from '@chakra-ui/react';
import { flexRecipe } from './flex.recipe';

const { withContext } = createRecipeContext({ recipe: flexRecipe });

export type FlexProps = HTMLChakraProps<'div', RecipeVariantProps<typeof flexRecipe>> &
    ChakraFlexProps;

export const Flex = withContext<HTMLDivElement, FlexProps>(ChakraFlex);
