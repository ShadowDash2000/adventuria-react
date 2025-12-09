import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { UserRecord } from '@shared/types/user';

export type TimerRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    user: RecordIdString;
    isActive: boolean;
    timePassed: number;
    timeLimit: number;
    startTime?: IsoDateString;
    expand?: TimerRecordExpand;
} & RecordModel;

export type TimerRecordExpand = { user: UserRecord };
