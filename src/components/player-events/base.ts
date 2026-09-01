import type { ReactNode } from 'react';
import type { PlayerEventRecord } from '@shared/types/player_event';

export abstract class PlayerEventDispenser {
    abstract eventNode(playerEvent: PlayerEventRecord): ReactNode;
}
