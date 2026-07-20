import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { WorldRecord } from '@shared/types/world';
import type { PlayerRecord } from '@shared/types/player';

export type PlayerProgressRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    season: RecordIdString;
    current_world: RecordIdString;
    can_move: boolean;
    points: number;
    balance: number;
    energy: number;
    cells_passed: number;
    is_in_jail: boolean;
    drops_in_a_row: number;
    item_wheels_count: number;
    max_inventory_slots: number;
    expand?: PlayerProgressRecordExpand;
} & RecordModel;

export type PlayerProgressRecordExpand = { player: PlayerRecord; current_world: WorldRecord };
