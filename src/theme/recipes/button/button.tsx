import {
    createRecipeContext,
    type HTMLChakraProps,
    type RecipeVariantProps,
    type ButtonProps as ChakraButtonProps,
    Button as ChakraButton,
    mergeProps,
} from '@chakra-ui/react';
import { buttonRecipe } from './button.recipe';
import { forwardRef } from 'react';

const { PropsProvider, usePropsContext, useRecipeResult } = createRecipeContext({
    key: 'adventuria-button',
    recipe: buttonRecipe,
});

type ButtonProps = HTMLChakraProps<'button', RecipeVariantProps<typeof buttonRecipe>> &
    ChakraButtonProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(inProps, ref) {
    const propsContext = usePropsContext();
    const props = mergeProps(propsContext, inProps);
    const result = useRecipeResult(props);

    return (
        <ChakraButton
            css={result.styles}
            className={result.className}
            {...result.props}
            ref={ref}
            unstyled
        />
    );
});

export const ButtonPropsProvider = PropsProvider;
