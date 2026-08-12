import {
    RatingGroup,
    RatingGroupRootProps,
    VStack,
    Text,
    HStack,
    NumberInput,
} from '@chakra-ui/react';
import { useState } from 'react';

type ReviewRatingProps = Omit<RatingGroupRootProps, 'count' | 'colorPalette'>;

const count = 10;
const defaultValue = 0;

export const ReviewRating = (props: ReviewRatingProps) => {
    const [value, setValue] = useState<number>(props.value ?? defaultValue);

    return (
        <VStack>
            <RatingGroup.Root
                allowHalf
                {...props}
                value={value}
                count={count}
                defaultValue={defaultValue}
                onValueChange={e => {
                    setValue(e.value);
                    props.onValueChange?.(e);
                }}
                colorPalette="yellow"
            >
                <RatingGroup.HiddenInput />
                <RatingGroup.Control />
            </RatingGroup.Root>
            <Text
                onClick={() => {
                    setValue(defaultValue);
                    props.onValueChange?.({ value: defaultValue });
                }}
                cursor="pointer"
                color="fg.subtle"
                textDecoration="underline dotted"
            >
                Без оценки
            </Text>
            <HStack>
                <NumberInput.Root
                    value={value.toString()}
                    defaultValue={defaultValue.toString()}
                    min={0}
                    max={count}
                    step={0.5}
                    formatOptions={{ maximumFractionDigits: 1 }}
                    onValueChange={e => {
                        const value = e.value === '' ? 0 : e.valueAsNumber;
                        setValue(value);
                        props.onValueChange?.({ value: value });
                    }}
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
                <Text>/{count}</Text>
            </HStack>
        </VStack>
    );
};
