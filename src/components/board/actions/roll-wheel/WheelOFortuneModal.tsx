import {
    CloseButton,
    Dialog,
    type DialogOpenChangeDetails,
    Flex as ChakraFlex,
    For,
    Image,
    Portal,
    Text,
} from '@chakra-ui/react';
import { WheelItem, WheelOFortune, type WheelOFortuneHandle } from './WheelOFortune';
import type { FC, JSX, RefObject } from 'react';
import { Flex } from '@ui/flex';

interface WheelOFortuneModalProps {
    trigger?: JSX.Element;
    open?: boolean;
    onOpenChange?: (open: DialogOpenChangeDetails) => void;
    wheelRef?: RefObject<WheelOFortuneHandle | null>;
    wheelItems: WheelItem[];
    currentItemIndex?: number;
    setCurrentItemIndex?: (index: number) => void;
    leftMenu?: JSX.Element;
    controlsMenu?: JSX.Element;
}

export const WheelOFortuneModal: FC<WheelOFortuneModalProps> = ({
    trigger,
    open,
    onOpenChange,
    wheelRef,
    wheelItems,
    currentItemIndex,
    setCurrentItemIndex,
    leftMenu,
    controlsMenu,
}) => {
    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={async e => {
                if (onOpenChange) onOpenChange(e);
            }}
            size="full"
        >
            <Dialog.Trigger>{trigger}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            {leftMenu}
                            <ChakraFlex gap={3} direction="column" justify="center">
                                <WheelOFortune ref={wheelRef} items={wheelItems} />
                                {controlsMenu}
                            </ChakraFlex>
                            <ChakraFlex
                                h="vh"
                                minW={400}
                                maxW={450}
                                flexDir="column"
                                overflowY="scroll"
                            >
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
                                                    if (setCurrentItemIndex)
                                                        setCurrentItemIndex(index);
                                                }}
                                                _hover={{ bg: 'grey' }}
                                                bg={currentItemIndex === index ? 'black' : ''}
                                            >
                                                <Image
                                                    src={item.image}
                                                    h="100%"
                                                    pointerEvents="none"
                                                />
                                                <Text pointerEvents="none">{item.title}</Text>
                                            </ChakraFlex>
                                        )}
                                    </For>
                                </Flex>
                            </ChakraFlex>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
