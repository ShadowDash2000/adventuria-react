import { useRef } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { VStack, Text, ButtonGroup, IconButton, Box, Clipboard } from '@chakra-ui/react';
import { FaCopy, FaPause, FaPlay } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { useAppContext } from '@context/AppContext';
import { useTimer } from './useTimer';

interface TimerProps {
    userId: RecordIdString;
}

export const Timer = ({ userId }: TimerProps) => {
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
        <VStack minW={200}>
            <Box w="full">
                <Text
                    position="relative"
                    fontSize="4xl"
                    ref={timerRef}
                    bgImage="linear-gradient(rgb(6, 9, 59), rgb(13, 34, 137))"
                    border="{spacing.0.5} solid rgb(198, 198, 198)"
                    borderRadius={12}
                    px={4}
                    _before={{
                        content: '""',
                        pointerEvents: 'none',
                        inset: 0,
                        position: 'absolute',
                        border: '{spacing.1} solid white',
                        borderRadius: 10,
                        width: '100%',
                        height: '100%',
                    }}
                >
                    00:00:00
                </Text>
            </Box>
            <ButtonGroup>
                <IconButton disabled={!isActive} _hover={{ bg: 'red' }} onClick={stopTimer}>
                    <FaPause />
                </IconButton>
                <IconButton disabled={isActive} _hover={{ bg: 'green' }} onClick={startTimer}>
                    <FaPlay />
                </IconButton>
                <Tooltip content="Ссылка для OBS">
                    <IconButton _hover={{ bg: 'orange' }}>
                        <Clipboard.Root value={`${window.location.origin}/timer/${userId}`}>
                            <Clipboard.Trigger asChild>
                                <FaCopy />
                            </Clipboard.Trigger>
                        </Clipboard.Root>
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        </VStack>
    );
};
