import { Box, Flex, HStack, Icon, Slider, Spinner, Text, VStack } from '@chakra-ui/react';
import { LuCirclePause, LuCirclePlay, LuSkipBack, LuSkipForward } from 'react-icons/lu';
import { SliderDebounced } from '@ui/slider-debounced';
import { type ClientResponseError } from 'pocketbase';
import { useRadio } from '@components/radio/useRadio';
import { useState } from 'react';
import { useIntervalWhen } from '@shared/hook/useIntervalWhen';
import { RadioTrackList } from '@components/radio/RadioTrackList';

export const Radio = () => {
    const {
        play,
        playById,
        pause,
        isPlaying,
        prevAudio,
        nextAudio,
        audioId,
        audioName,
        volume,
        setVolume,
        seek,
        currentTime,
        duration,
        isPending,
        isError,
        error,
        audio,
    } = useRadio();

    const [isDragging, setIsDragging] = useState(false);
    const [time, setTime] = useState(0);
    useIntervalWhen(
        () => {
            if (isDragging) return;
            setTime((currentTime() / duration()) * 100);
        },
        { ms: 300, when: isPlaying && !isDragging, startImmediately: true },
    );

    if (isPending) {
        return (
            <Flex justify="center" align="center">
                <Spinner />
            </Flex>
        );
    }

    if (isError) {
        const e = error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex h="{sizes.32}" justify="space-around" align="center" overflowY="hidden">
            <Box w="{sizes.48}" maxH="full" overflowY="auto">
                <RadioTrackList audioId={audioId} audio={audio} onTrackChange={playById} />
            </Box>
            <VStack>
                <Text>{audioName || '-'}</Text>
                <VStack>
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
                    <Slider.Root
                        w={350}
                        value={[time]}
                        min={0}
                        max={100}
                        step={0.01}
                        onValueChange={details => setTime(details.value[0])}
                        onValueChangeEnd={e => {
                            if (!duration()) return;
                            seek((e.value[0] / 100) * duration());
                            setIsDragging(false);
                        }}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs
                                onPointerDown={() => {
                                    setIsDragging(true);
                                }}
                            />
                        </Slider.Control>
                    </Slider.Root>
                </VStack>
            </VStack>
            <SliderDebounced w="{sizes.48}" value={volume} setValue={val => setVolume(val)} />
        </Flex>
    );
};
