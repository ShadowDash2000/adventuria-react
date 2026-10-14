import { Button, Text } from '@chakra-ui/react';
import { PlayerEventDispenser } from '@components/player-events/base';
import type { PlayerEventRecord } from '@shared/types/player_event';
import type { ReactNode } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useItemsStore } from '@components/items/useItemsStore';
import { type ItemType, ItemTypeInfo } from '@shared/types/item';

export class ItemReceived extends PlayerEventDispenser {
    eventNode(playerEvent: PlayerEventRecord): ReactNode {
        const payload = playerEvent.payload as Payload;

        return <ItemReceivedItem payload={payload} />;
    }
}

export const sources = {
    item_wheel: { label: 'Колесо предметов' },
    shop: { label: 'Магазин' },
    another_item: { label: 'Предмет' },
    dealer: { label: 'Дилер' },
    debug: { label: 'Debug' },
};

type Payload = {
    item_id: RecordIdString;
    item_name: string;
    item_type: ItemType;
    source?: keyof typeof sources;
};

const ItemReceivedItem = ({ payload }: { payload: Payload }) => {
    const openItemDetails = useItemsStore(state => state.openItemDetails);

    return (
        <Text>
            Получен предмет{' '}
            <Button
                unstyled
                textDecoration="underline"
                cursor="pointer"
                color={ItemTypeInfo[payload.item_type]?.color}
                onClick={() => openItemDetails(payload.item_id)}
            >
                {payload.item_name}
            </Button>
            {payload.source && ` (${sources[payload.source].label})`}
        </Text>
    );
};
