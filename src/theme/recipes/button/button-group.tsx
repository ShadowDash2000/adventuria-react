import { forwardRef } from 'react';
import { type ButtonGroupProps, Group, useRecipe } from '@chakra-ui/react';
import { buttonRecipe } from './button.recipe';
import { ButtonPropsProvider } from './button';

export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>(
    function ButtonGroup(props, ref) {
        const recipe = useRecipe({ key: 'adventuria-button', recipe: buttonRecipe });
        const [variantProps, otherProps] = recipe.splitVariantProps(props);

        return (
            <ButtonPropsProvider value={variantProps}>
                <Group ref={ref} {...otherProps} />
            </ButtonPropsProvider>
        );
    },
);
