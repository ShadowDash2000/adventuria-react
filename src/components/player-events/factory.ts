import { PlayerEventDispenser } from '@components/player-events/base';
import { Unknown } from '@components/player-events/unknown';
import { ItemReceived } from '@components/player-events/item-received/item-received';

export class PlayerEventsFactory {
    private static actions: Record<string, PlayerEventDispenser> = {
        item_received: new ItemReceived(),
    };

    static get(playerEventType: string): PlayerEventDispenser {
        return this.actions[playerEventType] || new Unknown();
    }
}
