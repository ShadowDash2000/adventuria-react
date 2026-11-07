import { forwardRef } from 'react';
import {
    type ButtonGroupProps as ChakraButtonGroupProps,
    type RecipeVariantProps,
    Group,
    useRecipe,
} from '@chakra-ui/react';
import type { buttonRecipe } from '../../adventuria-3/recipes/button.recipe';
import { ButtonPropsProvider } from './button';

type ButtonGroupProps = ChakraButtonGroupProps & RecipeVariantProps<typeof buttonRecipe>;

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
    function ButtonGroup(props, ref) {
        const recipe = useRecipe({ key: 'adventuriaButton' });
        const [variantProps, otherProps] = recipe.splitVariantProps(props);

        return (
            <ButtonPropsProvider value={variantProps}>
                <Group ref={ref} {...otherProps} />
            </ButtonPropsProvider>
        );
    },
);
