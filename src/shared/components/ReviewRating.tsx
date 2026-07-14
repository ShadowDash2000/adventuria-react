import { RatingGroup, RatingGroupRootProps, VStack, Text } from '@chakra-ui/react';

type ReviewRatingProps = Omit<RatingGroupRootProps, 'count' | 'colorPalette'>;

const count = 10;
const defaultValue = 5;

export const ReviewRating = (props: ReviewRatingProps) => {
    return (
        <VStack>
            <RatingGroup.Root
                {...props}
                count={count}
                defaultValue={defaultValue}
                colorPalette="yellow"
            >
                <RatingGroup.HiddenInput />
                <RatingGroup.Control />
            </RatingGroup.Root>
            <Text>
                {props.value || defaultValue}/{count}
            </Text>
        </VStack>
    );
};
