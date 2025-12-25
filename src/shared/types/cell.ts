import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActivityFilterRecord } from '@shared/types/filter';

export type CellRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    sort: number;
    type: string;
    filter: RecordIdString;
    audioPresets: RecordIdString[];
    icon: string;
    name: string;
    points: number;
    coins: number;
    description: string;
    color: string;
    cantDrop: boolean;
    cantReroll: boolean;
    cantChooseAfterDrop: boolean;
    isSafeDrop: boolean;
    expand?: FilterRecordExpand;
} & RecordModel;

export type FilterRecordExpand = Partial<{ filter: ActivityFilterRecord }>;
