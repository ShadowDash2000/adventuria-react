import type { AuthRecord } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { WorldRecord } from '@shared/types/world';

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
    stats?: PlayerStats;
    expand?: PlayerProgressRecordExpand;
} & AuthRecord;

export type PlayerStats = {
    drops: number;
    rerolls: number;
    finished: number;
    wasInJail: number;
    itemsUsed: number;
    diceRolls: number;
    maxDiceRoll: number;
    wheelRolled: number;
};

export type PlayerProgressRecordExpand = { current_world: WorldRecord };
