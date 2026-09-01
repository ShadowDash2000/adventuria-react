import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerEventRecord } from '@shared/types/player_event';
import type { ReactNode } from 'react';
import { PlayerEventsFactory } from '@components/player-events/factory';
import { Box, For, Heading, VStack, Text } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';

interface EventsProps {
    playerEvents: PlayerEventRecord[];
}

export const Events = ({ playerEvents }: EventsProps) => {
    if (playerEvents.length === 0) {
        return null;
    }

    const nodes = playerEvents.map(playerEvent => {
        const playerEventDispenser = PlayerEventsFactory.get(playerEvent.type);
        return {
            id: playerEvent.id,
            created: playerEvent.created,
            node: playerEventDispenser.eventNode(playerEvent),
        };
    });

    return (
        <VStack w="full">
            <Heading size="lg" as="h3">
                Последние события
            </Heading>
            <Box w="full" maxH={24} overflowY="auto">
                <For each={nodes}>
                    {event => (
                        <VStack gap={0} key={event.id}>
                            <Text>{formatDateLocalized(event.created)}</Text>
                            {event.node}
                        </VStack>
                    )}
                </For>
            </Box>
        </VStack>
    );
};
