import { VStack } from '@chakra-ui/react';
import { RadioButton } from '@components/radio/RadioButton';

export const UserMenuGuest = () => {
    return (
        <VStack
            position="fixed"
            w="3.5rem"
            left={0}
            bottom={0}
            pl={4}
            mb={10}
            zIndex={100}
            align="left"
        >
            <VStack justify="center" align="start">
                <RadioButton />
            </VStack>
        </VStack>
    );
};
