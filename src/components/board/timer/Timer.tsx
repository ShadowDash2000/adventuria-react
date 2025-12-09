import { useRef, type FC } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { VStack, Text, ButtonGroup, IconButton, Box, Float, Clipboard } from '@chakra-ui/react';
import { FaCopy, FaPause, FaPlay } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { useTimer } from './useTimer';

interface TimerProps {
    userId: RecordIdString;
}

export const Timer: FC<TimerProps> = ({ userId }) => {
    const { pb } = useAppContext();
    const timerRef = useRef<HTMLParagraphElement | null>(null);
    const { isActive, startTimer, stopTimer } = useTimer({
        authToken: pb.authStore.token,
        collection: pb.collection('timers'),
        userId: userId,
        realtimeUpdate: true,
        onValueChange: value => {
            if (!timerRef.current) return;
            timerRef.current.innerText = value;
        },
    });

    return (
        <VStack>
            <Box>
                <Text fontSize="4xl" ref={timerRef}>
                    00:00:00
                </Text>
                <Tooltip content="Ссылка для OBS">
                    <Float placement="top-start" offset={-2}>
                        <Clipboard.Root value={`${window.location.origin}/timer/${userId}`}>
                            <Clipboard.Trigger asChild>
                                <IconButton size="xs" variant="surface">
                                    <FaCopy />
                                </IconButton>
                            </Clipboard.Trigger>
                        </Clipboard.Root>
                    </Float>
                </Tooltip>
            </Box>
            <ButtonGroup>
                <IconButton disabled={!isActive} _hover={{ bg: 'red' }} onClick={stopTimer}>
                    <FaPause />
                </IconButton>
                <IconButton disabled={isActive} _hover={{ bg: 'green' }} onClick={startTimer}>
                    <FaPlay />
                </IconButton>
            </ButtonGroup>
        </VStack>
    );
};
