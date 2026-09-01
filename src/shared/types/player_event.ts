import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { RecordModel } from 'pocketbase';

export type PlayerEventRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    season: RecordIdString;
    type: string;
    action: RecordIdString;
    payload: unknown;
} & RecordModel;
