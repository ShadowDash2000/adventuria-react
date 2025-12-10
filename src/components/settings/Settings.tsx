import { Collapsible, Flex as ChakraFlex } from '@chakra-ui/react';
import { LuChevronUp } from 'react-icons/lu';
import { Flex } from '@ui/flex';
import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

export const Settings = () => {
    const { volume, setVolume } = useAudioPlayer(AudioKey.music);

    return (
        <ChakraFlex
            zIndex={60}
            position="fixed"
            right={0}
            pr={4}
            visibility={{ base: 'visible', lgDown: 'hidden' }}
        >
            <Collapsible.Root minW="18rem">
                <Collapsible.Trigger
                    w="100%"
                    py={3}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    justifyContent="end"
                >
                    <Collapsible.Indicator
                        transition="transform 0.2s"
                        _open={{ transform: 'rotate(180deg)' }}
                    >
                        <LuChevronUp />
                    </Collapsible.Indicator>
                    Настройки
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Flex flexDir="column" p={5}>
                        <SliderDebounced
                            value={volume}
                            setValue={val => setVolume(val)}
                            label="Громкость"
                        />
                    </Flex>
                </Collapsible.Content>
            </Collapsible.Root>
        </ChakraFlex>
    );
};
