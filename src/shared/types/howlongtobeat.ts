import type { RecordModel } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type HowLongToBeatRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    id_db: number;
    name: string;
    campaign: number;
} & RecordModel;
