import type { AuthRecord } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type PlayerRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    avatar: string;
    color: string;
    description: string;
    twitch: string;
    youtube: string;
    is_stream_live: boolean;
} & AuthRecord;
