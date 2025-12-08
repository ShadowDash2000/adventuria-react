import { Flex as ChakraFlex, For, Image, Text } from '@chakra-ui/react';
import { WheelItem, WheelOFortune, type WheelOFortuneHandle } from './WheelOFortune';
import type { FC, JSX, RefObject } from 'react';
import { Flex } from '@ui/flex';

interface WheelOFortuneContentProps {
    wheelRef?: RefObject<WheelOFortuneHandle | null>;
    wheelItems: WheelItem[];
    currentItemIndex?: number;
    setCurrentItemIndex?: (index: number) => void;
    leftMenu?: JSX.Element;
    controlsMenu?: JSX.Element;
}

export const WheelOFortuneContent: FC<WheelOFortuneContentProps> = ({
    wheelRef,
    wheelItems,
    currentItemIndex,
    setCurrentItemIndex,
    leftMenu,
    controlsMenu,
}) => {
    return (
        <>
            {leftMenu}
            <ChakraFlex gap={3} direction="column" justify="center">
                <WheelOFortune ref={wheelRef} items={wheelItems} />
                {controlsMenu}
            </ChakraFlex>
            <ChakraFlex h="vh" minW={400} maxW={450} flexDir="column" overflowY="scroll">
                <Flex flexDir="column" gap={2} py={4}>
                    <For each={wheelItems}>
                        {(item, index) => (
                            <ChakraFlex
                                key={item.key}
                                h={20}
                                align="center"
                                gap={4}
                                cursor="pointer"
                                px={4}
                                onClick={() => {
                                    if (setCurrentItemIndex) setCurrentItemIndex(index);
                                }}
                                _hover={{ bg: 'grey' }}
                                bg={currentItemIndex === index ? 'black' : ''}
                            >
                                <Image src={item.image} h="100%" pointerEvents="none" />
                                <Text pointerEvents="none">{item.title}</Text>
                            </ChakraFlex>
                        )}
                    </For>
                </Flex>
            </ChakraFlex>
        </>
    );
};
