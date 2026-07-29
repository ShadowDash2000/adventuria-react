import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActivityFilterRecord } from '@shared/types/filter';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import type { WorldRecord } from '@shared/types/world';
import type { CellEventRecord } from '@shared/types/cell_event';

export type CellRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    disabled: boolean;
    sort: number;
    type: string;
    world: RecordIdString;
    filter: RecordIdString;
    audio_preset: RecordIdString;
    icon: string;
    name: string;
    points: number;
    energy_consume: number;
    coins: number;
    description: string;
    color: string;
    cant_drop: boolean;
    cant_reroll: boolean;
    is_safe_drop: boolean;
    is_custom_filter_not_allowed: boolean;
    is_change_game_not_allowed: boolean;
    cell_event?: CellEventRecord;
    expand?: FilterRecordExpand;
} & RecordModel;

export type FilterRecordExpand = Partial<{
    filter: ActivityFilterRecord;
    audio_preset: AudioPresetRecord;
    world: WorldRecord;
}>;
