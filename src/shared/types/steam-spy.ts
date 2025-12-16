import type { RecordModel } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type SteamSpyRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    id_db: number;
    name: string;
    price: number;
} & RecordModel;
