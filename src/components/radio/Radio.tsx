import { Box, Flex, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { LuCirclePause, LuCirclePlay, LuLoader, LuSkipBack, LuSkipForward } from 'react-icons/lu';
import { SliderDebounced } from '@ui/slider-debounced';
import { type ClientResponseError } from 'pocketbase';
import { useRadio } from '@components/radio/useRadio';

export const Radio = () => {
    const {
        play,
        pause,
        isPlaying,
        prevAudio,
        nextAudio,
        audioName,
        volume,
        setVolume,
        isPending,
        isError,
        error,
    } = useRadio();

    if (isPending) {
        return (
            <Flex justify="center" align="center">
                <LuLoader />
            </Flex>
        );
    }

    if (isError) {
        const e = error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex justify="space-around" align="center">
            <Box w="{sizes.48}" />
            <VStack>
                <Text>{audioName || '-'}</Text>
                <HStack>
                    <Icon w="{sizes.8}" h="{sizes.8}" _hover={{ cursor: 'pointer' }}>
                        <LuSkipBack onClick={prevAudio} />
                    </Icon>
                    <Icon w="{sizes.14}" h="{sizes.14}" _hover={{ cursor: 'pointer' }}>
                        {isPlaying ? (
                            <LuCirclePause onClick={pause} />
                        ) : (
                            <LuCirclePlay onClick={play} />
                        )}
                    </Icon>
                    <Icon w="{sizes.8}" h="{sizes.8}" _hover={{ cursor: 'pointer' }}>
                        <LuSkipForward onClick={nextAudio} />
                    </Icon>
                </HStack>
            </VStack>
            <SliderDebounced w="{sizes.48}" value={volume} setValue={val => setVolume(val)} />
        </Flex>
    );
};
