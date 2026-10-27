import { Box, Flex, HStack, Icon, Spinner, Text, VStack } from '@chakra-ui/react';
import { LuCirclePause, LuCirclePlay } from 'react-icons/lu';
import { FaPlayCircle } from 'react-icons/fa';
import { SliderDebounced } from '@ui/slider-debounced';
import { type ClientResponseError } from 'pocketbase';
import { useRadio } from '@components/radio/useRadio';
import { RadioTrackList } from '@components/radio/RadioTrackList';
import { RadioProgress } from '@components/radio/RadioProgress';
import { RadioProgressText } from '@components/radio/RadioProgressText';

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
        setVolumeImmediate,
        seek,
        currentTime,
        duration,
        isPending,
        isError,
        error,
        audio,
    } = useRadio();

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
        <Flex h={36} justify="space-around" align="center">
            <Box w={48}>
                <RadioTrackList audioId={audioId} audio={audio} onTrackChange={playById} />
            </Box>
            <VStack>
                <Text>{audioName || '-'}</Text>
                <VStack>
                    <HStack>
                        <Icon w={8} h={8} _hover={{ cursor: 'pointer' }} transform="scaleX(-1)">
                            <FaPlayCircle onClick={prevAudio} />
                        </Icon>
                        <Icon w={14} h={14} _hover={{ cursor: 'pointer' }}>
                            {isPlaying ? (
                                <LuCirclePause onClick={pause} />
                            ) : (
                                <LuCirclePlay onClick={play} />
                            )}
                        </Icon>
                        <Icon w={8} h={8} _hover={{ cursor: 'pointer' }}>
                            <FaPlayCircle onClick={nextAudio} />
                        </Icon>
                    </HStack>
                    <RadioProgressText currentTime={currentTime} duration={duration} />
                    <RadioProgress
                        currentTime={currentTime}
                        duration={duration}
                        seek={seek}
                        isPlaying={isPlaying}
                    />
                </VStack>
            </VStack>
            <SliderDebounced
                w={48}
                value={volume}
                setValue={val => setVolume(val)}
                onValueChangeImmediate={val => setVolumeImmediate(val)}
                commitMode="end"
            />
        </Flex>
    );
};
