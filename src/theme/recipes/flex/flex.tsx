import {
    createRecipeContext,
    type HTMLChakraProps,
    type RecipeVariantProps,
    type FlexProps as ChakraFlexProps,
    Flex as ChakraFlex,
} from '@chakra-ui/react';
import type { flexRecipe } from '../../adventuria-3/recipes/flex.recipe';

const { withContext } = createRecipeContext({ key: 'adventuriaFlex' });

export type FlexProps = HTMLChakraProps<'div', RecipeVariantProps<typeof flexRecipe>> &
    ChakraFlexProps;

export const Flex = withContext<HTMLDivElement, FlexProps>(ChakraFlex);
