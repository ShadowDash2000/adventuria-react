import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';

export type CellRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    isActive: boolean;
    sort: number;
    type: string;
    preset: RecordIdString;
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
} & RecordModel;
