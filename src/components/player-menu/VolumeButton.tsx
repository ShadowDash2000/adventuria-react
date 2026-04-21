import { Float, IconButton, HStack, Box } from '@chakra-ui/react';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, DEFAULT_VOLUME, useAudioPlayer } from '@shared/hook/useAudio';
import { useState } from 'react';
import { Tooltip } from '@ui/tooltip';

export const VolumeButton = () => {
    const { volume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);
    const [hovered, setHovered] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (!isDragging) {
            setHovered(false);
        }
    };

    const handleDragStart = () => {
        setIsDragging(true);
        setHovered(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
        if (!isHovering) {
            setHovered(false);
        }
    };

    return (
        <HStack position="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Float
                hidden={!hovered}
                h="full"
                w={52}
                pl={2}
                translate="100% 0"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    bg="white"
                    w="full"
                    h="full"
                    px={3}
                    borderRadius="sm"
                    display="flex"
                    alignItems="center"
                >
                    <SliderDebounced
                        w="full"
                        value={volume}
                        setValue={val => setVolume(val)}
                        onValueChangeImmediate={val => setVolumeImmediate(val)}
                        colorPalette="orange"
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        commitMode="end"
                    />
                </Box>
            </Float>
            <Tooltip content="Громкость">
                <IconButton
                    _hover={{ bg: 'orange' }}
                    onClick={() => setVolume(volume > 0 ? 0 : DEFAULT_VOLUME)}
                >
                    {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                </IconButton>
            </Tooltip>
        </HStack>
    );
};
