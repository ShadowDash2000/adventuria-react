import { PlayerEventDispenser } from '@components/player-events/base';
import type { PlayerEventRecord } from '@shared/types/player_event';
import type { ReactNode } from 'react';
import { Text } from '@chakra-ui/react';

export class EnergyChanged extends PlayerEventDispenser {
    eventNode(playerEvent: PlayerEventRecord): ReactNode {
        const payload = playerEvent.payload as Payload;

        return <EnergyChangedItem payload={payload} />;
    }
}

export const sources = {
    daily_reward: { label: 'Ежедневная награда' },
    activity_done: { label: 'Завершение' },
    activity_drop: { label: 'Дроп' },
};

type Payload = { amount: number; source?: keyof typeof sources };

const EnergyChangedItem = ({ payload }: { payload: Payload }) => {
    const sourceLabel =
        payload.source && sources[payload.source] ? sources[payload.source].label : '';

    return (
        <Text>
            Очки энергии — {payload.amount >= 0 ? '+' : ''}
            {payload.amount}
            {sourceLabel && ` (${sourceLabel})`}
        </Text>
    );
};
