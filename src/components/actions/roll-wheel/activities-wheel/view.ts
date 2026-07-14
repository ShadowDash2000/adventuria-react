import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActivityType } from '@shared/types/activity';

export type ActivityViewDetailed = {
    activity: ActivityView;
    platforms: PlatformView[];
    developers: CompanyView[];
    publishers: CompanyView[];
    genres: GenreView[];
    tags: TagView[];
    themes: ThemeView[];
};

export type ActivityView = {
    id: RecordIdString;
    collectionName: string;
    type: ActivityType;
    name: string;
    slug: string;
    release_date?: IsoDateString;
    platforms: RecordIdString[];
    developers: RecordIdString[];
    publishers: RecordIdString[];
    genres: RecordIdString[];
    tags: RecordIdString[];
    themes: RecordIdString[];
    game_type: string;
    steam_app_id: number;
    steam_app_price: number;
    hltb_id: number;
    hltb_campaign_time: number;
    cover: string;
    cover_alt: RecordIdString;
};

export type PlatformView = { id: RecordIdString; name: string };

export type CompanyView = { id: RecordIdString; name: string };

export type GenreView = { id: RecordIdString; name: string };

export type TagView = { id: RecordIdString; name: string };

export type ThemeView = { id: RecordIdString; name: string };
