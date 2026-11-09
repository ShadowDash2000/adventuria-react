import {
    type HTMLChakraProps,
    type ImageProps,
    type RecipeVariantProps,
    Image,
    useRecipe,
} from '@chakra-ui/react';
import { coverRecipe } from '@/theme/adventuria-3/recipes/cover.recipe';

type CoverImageProps = HTMLChakraProps<'image', RecipeVariantProps<typeof coverRecipe>> &
    ImageProps;

interface CoverProps extends Omit<CoverImageProps, 'src'> {
    coverUrl?: string;
    coverAltUrl?: string;
}

export const Cover = ({ coverUrl, coverAltUrl, ...rest }: CoverProps) => {
    const recipe = useRecipe({ key: 'adventuriaCover' });
    const styles = recipe(rest);

    return <Image css={styles} {...rest} src={coverUrl || coverAltUrl} />;
};
