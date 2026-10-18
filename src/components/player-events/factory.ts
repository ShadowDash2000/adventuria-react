import { PlayerEventDispenser } from '@components/player-events/base';
import { Unknown } from '@components/player-events/unknown';
import { ItemReceived } from '@components/player-events/item-received/item-received';
import { EnergyChanged } from '@components/player-events/energy-changed/energy-changed';

export class PlayerEventsFactory {
    private static actions: Record<string, PlayerEventDispenser> = {
        item_received: new ItemReceived(),
        energy_changed: new EnergyChanged(),
    };

    static get(playerEventType: string): PlayerEventDispenser {
        return this.actions[playerEventType] || new Unknown();
    }
}
