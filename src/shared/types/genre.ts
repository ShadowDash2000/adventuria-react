import type { RecordModel } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type GenreRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    id_db: string;
    name: string;
    checksum: string;
} & RecordModel;
