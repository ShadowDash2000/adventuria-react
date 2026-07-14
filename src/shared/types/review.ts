import type { IsoDateString } from '@shared/types/pocketbase';
import type { RecordModel } from 'pocketbase';

export type ReviewRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    comment: string;
    score: number;
} & RecordModel;
