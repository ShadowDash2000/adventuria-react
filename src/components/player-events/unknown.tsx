import { PlayerEventDispenser } from '@components/player-events/base';
import { Text } from '@chakra-ui/react';

export class Unknown extends PlayerEventDispenser {
    eventNode() {
        return <Text>Неизвестное событие</Text>;
    }
}
