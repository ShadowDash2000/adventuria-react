import type { RecordModel } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type EffectRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    type: string;
    value: string;
} & RecordModel;
