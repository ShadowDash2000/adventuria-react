import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import { ItemRecord } from '@shared/types/item';
import { EffectRecord } from '@shared/types/effect';

export type InventoryItemRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    item: RecordIdString;
    is_active: boolean;
    can_use: boolean;
    can_drop: boolean;
    applied_effects: RecordIdString[];
    expand?: InventoryItemRecordExpand;
} & RecordModel;

export type InventoryItemRecordExpand = {
    user: PlayerRecord;
    item: ItemRecord;
    appliedEffects?: EffectRecord[];
};
