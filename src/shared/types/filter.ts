import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { PlatformRecord } from '@shared/types/platform';
import type { CompanyRecord } from '@shared/types/company';
import type { GenreRecord } from '@shared/types/genre';
import type { TagRecord } from '@shared/types/tag';
import type { GameRecord } from '@shared/types/game';

export type FilterRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    platforms: RecordIdString[];
    developers: RecordIdString[];
    publishers: RecordIdString[];
    genres: RecordIdString[];
    tags: RecordIdString[];
    min_price: number;
    max_price: number;
    release_date_from: IsoDateString;
    release_date_to: IsoDateString;
    min_campaign_time: number;
    max_campaign_time: number;
    games: RecordIdString[];
    expand?: FilterRecordExpand;
} & RecordModel;

export type FilterRecordExpand = Partial<{
    platforms: PlatformRecord[];
    developers: CompanyRecord[];
    publishers: CompanyRecord[];
    genres: GenreRecord[];
    tags: TagRecord[];
    games: GameRecord[];
}>;
