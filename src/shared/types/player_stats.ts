import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { RecordModel } from 'pocketbase';

export type PlayerStatsRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    season: RecordIdString;
    activities?: {
        games_completed: number;
        movies_completed: number;
        gyms_completed: number;
        karaoke_completed: number;
    };
    cells_passed: number;
    drops: number;
    rerolls: number;
    was_in_jail: number;
    items_used: number;
    dice_rolls: number;
    max_dice_roll: number;
    wheels_rolled: number;
    expand?: PlayerStatsRecordExpand;
} & RecordModel;

export type PlayerStatsRecordExpand = { player: PlayerRecord };
