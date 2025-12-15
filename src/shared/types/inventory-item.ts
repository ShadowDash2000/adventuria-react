import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { UserRecord } from '@shared/types/user';
import { ItemRecord } from '@shared/types/item';
import { EffectRecord } from '@shared/types/effect';

export type InventoryItemRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    user: RecordIdString;
    item: RecordIdString;
    isActive: boolean;
    appliedEffects: RecordIdString[];
    expand?: InventoryItemRecordExpand;
} & RecordModel;

export type InventoryItemRecordExpand = {
    user: UserRecord;
    item: ItemRecord;
    appliedEffects?: EffectRecord[];
};
