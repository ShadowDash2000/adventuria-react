import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import { AudioRecord } from '@shared/types/audio';

export type AudioPresetRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    slug: string;
    audio: RecordIdString[];
    expand?: AudioPresetRecordExpand;
} & RecordModel;

export type AudioPresetRecordExpand = { audio: AudioRecord[] };
