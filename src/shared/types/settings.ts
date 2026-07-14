import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';

export type SettingsRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    event_start_date: IsoDateString;
    current_season: RecordIdString;
    current_week: number;
    event_ended: boolean;
    block_all_actions: boolean;
    energy_default: number;
    max_inventory_slots: number;
    points_for_drop: number;
    drops_to_jail: number;
} & RecordModel;
