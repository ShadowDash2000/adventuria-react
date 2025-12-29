import { useRef } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { VStack, Text, ButtonGroup, IconButton, Clipboard } from '@chakra-ui/react';
import { FaCopy, FaPause, FaPlay } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { useAppContext } from '@context/AppContext';
import { useTimer } from './useTimer';
import { Flex } from '@theme/flex';

interface TimerProps {
    userId: RecordIdString;
}

export const Timer = ({ userId }: TimerProps) => {
    const { pb } = useAppContext();
    const timerRef = useRef<HTMLParagraphElement | null>(null);
    const { isActive, nextResetDate, startTimer, stopTimer } = useTimer({
        authToken: pb.authStore.token,
        userId: userId,
        realtimeUpdate: true,
        onValueChange: value => {
            if (!timerRef.current) return;
            timerRef.current.innerText = value;
        },
    });

    return (
        <VStack minW={200}>
            <Flex
                variant="solid"
                w="full"
                py={4}
                flexDir="column"
                align="center"
                overflowY="hidden"
            >
                <Text>{nextResetDate}</Text>
                <Text lineHeight={1} fontSize="4xl" ref={timerRef}>
                    00:00:00
                </Text>
            </Flex>
            <ButtonGroup>
                <IconButton disabled={!isActive} _hover={{ bg: 'red' }} onClick={stopTimer}>
                    <FaPause />
                </IconButton>
                <IconButton disabled={isActive} _hover={{ bg: 'green' }} onClick={startTimer}>
                    <FaPlay />
                </IconButton>
                <Clipboard.Root value={`${window.location.origin}/timer/${userId}`}>
                    <Clipboard.Trigger>
                        <Tooltip content="Ссылка для OBS">
                            <IconButton _hover={{ bg: 'orange' }} as="div">
                                <FaCopy />
                            </IconButton>
                        </Tooltip>
                    </Clipboard.Trigger>
                </Clipboard.Root>
            </ButtonGroup>
        </VStack>
    );
};
