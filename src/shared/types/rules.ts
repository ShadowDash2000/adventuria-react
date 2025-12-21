import type { RecordModel } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type RuleRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    sort: number;
    title: string;
    rules: string;
} & RecordModel;
