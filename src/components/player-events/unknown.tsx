import { PlayerEventDispenser } from '@components/player-events/base';

export class Unknown extends PlayerEventDispenser {
    eventNode() {
        return null;
    }
}
