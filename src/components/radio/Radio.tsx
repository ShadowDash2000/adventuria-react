import { Box, Flex, VStack } from '@chakra-ui/react';
import { RadioTrackList } from '@components/radio/RadioTrackList';
import { RadioVolume } from '@components/radio/RadioVolume';
import { RadioProgress } from '@components/radio/RadioProgress';
import { RadioTrackControls } from '@components/radio/RadioTrackControls';
import { RadioTrackTitle } from '@components/radio/RadioTrackTitle';

export const Radio = () => {
    return (
        <Flex h={36} justify="space-around" align="center">
            <Box w={48}>
                <RadioTrackList />
            </Box>
            <VStack>
                <RadioTrackTitle />
                <VStack>
                    <RadioTrackControls />
                    <RadioProgress />
                </VStack>
            </VStack>
            <RadioVolume />
        </Flex>
    );
};
