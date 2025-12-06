import { Collapsible, Flex as ChakraFlex } from '@chakra-ui/react';
import { LuChevronUp } from 'react-icons/lu';
import { Flex } from '@ui/flex';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { VolumeSlider } from './VolumeSlider';

export const Settings = () => {
    const { audioActions } = useAppContext();

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
                        <VolumeSlider
                            volume={audioActions.volume}
                            setVolume={val => audioActions.setVolume(val)}
                        />
                    </Flex>
                </Collapsible.Content>
            </Collapsible.Root>
        </ChakraFlex>
    );
};
