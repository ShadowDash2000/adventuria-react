import { Grid, HStack, Icon } from '@chakra-ui/react';
import { hasPlayMode, PlayMode } from '@components/radio/useRadioStore';
import { FaShuffle } from 'react-icons/fa6';
import { FaPlayCircle } from 'react-icons/fa';
import { LuCirclePause, LuCirclePlay } from 'react-icons/lu';
import { useRadio } from '@components/radio/useRadio';

export const RadioTrackControls = () => {
    const { isPlaying, play, pause, prev, next, shuffle, unshuffle, playMode } = useRadio();

    const isShuffled = hasPlayMode(playMode, PlayMode.Shuffle);

    return (
        <Grid templateColumns="1fr auto 1fr" alignItems="center" gap={2}>
            <Icon
                w={4}
                h={4}
                data-active={isShuffled}
                data-not-active={!isShuffled}
                _hover={{ cursor: 'pointer' }}
                css={{
                    '&[data-active="true"]': { opacity: 1 },
                    '&[data-not-active="true"]': { opacity: 0.5 },
                }}
            >
                <FaShuffle onClick={isShuffled ? unshuffle : shuffle} />
            </Icon>
            <HStack>
                <Icon w={8} h={8} _hover={{ cursor: 'pointer' }} transform="scaleX(-1)">
                    <FaPlayCircle onClick={prev} />
                </Icon>
                <Icon w={14} h={14} _hover={{ cursor: 'pointer' }}>
                    {isPlaying ? (
                        <LuCirclePause onClick={pause} />
                    ) : (
                        <LuCirclePlay onClick={play} />
                    )}
                </Icon>
                <Icon w={8} h={8} _hover={{ cursor: 'pointer' }}>
                    <FaPlayCircle onClick={next} />
                </Icon>
            </HStack>
        </Grid>
    );
};
