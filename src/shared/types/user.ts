import type { AuthRecord } from 'pocketbase';
import type { IsoDateString } from '@shared/types/pocketbase';

export type UserRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    avatar: string;
    color: string;
    points: number;
    cellsPassed: number;
    isInJail: boolean;
    dropsInARow: number;
    maxInventorySlots: number;
    itemWheelsCount: number;
    description: string;
    stats?: UserStats;
    balance: number;
    twitch: string;
    youtube: string;
    is_stream_live: boolean;
} & AuthRecord;

export type UserStats = {
    drops: number;
    rerolls: number;
    finished: number;
    wasInJail: number;
    itemsUsed: number;
    diceRolls: number;
    maxDiceRoll: number;
    wheelRolled: number;
};
