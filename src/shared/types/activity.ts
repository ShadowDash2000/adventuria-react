import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { PlatformRecord } from '@shared/types/platform';
import type { CompanyRecord } from '@shared/types/company';
import type { GenreRecord } from '@shared/types/genre';
import type { TagRecord } from '@shared/types/tag';

export const enum ActivityType {
    Game = 'game',
    Movie = 'movie',
    Gym = 'gym',
}

export type ActivityRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    id_db: string;
    type: ActivityType;
    name: string;
    slug: string;
    release_date?: IsoDateString;
    platforms: RecordIdString[];
    developers: RecordIdString[];
    publishers: RecordIdString[];
    genres: RecordIdString[];
    tags: RecordIdString[];
    steam_app_id: number;
    steam_app_price: number;
    hltb_id: number;
    hltb_campaign_time: number;
    cover: string;
    checksum: string;
    expand?: ActivityRecordExpand;
} & RecordModel;

export type ActivityRecordExpand = Partial<{
    platforms: PlatformRecord[];
    developers: CompanyRecord[];
    publishers: CompanyRecord[];
    genres: GenreRecord[];
    tags: TagRecord[];
}>;
