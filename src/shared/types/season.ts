import type { IsoDateString } from '@shared/types/pocketbase';
import type { RecordModel } from 'pocketbase';

export type SeasonRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    slug: string;
    season_date_start: IsoDateString;
    season_date_end: IsoDateString;
} & RecordModel;
