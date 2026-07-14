import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { EffectRecord } from '@shared/types/effect';

export type WorldRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    slug: string;
    sort: number;
    is_loop: boolean;
    is_default_world: boolean;
    transition_to_world: RecordIdString;
    effects: RecordIdString[];
    expand?: WorldRecordExpand;
} & RecordModel;

export type WorldRecordExpand = { effects: EffectRecord[] };
