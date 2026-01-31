import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import { EffectRecord } from '@shared/types/effect';

export type ItemRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    name: string;
    icon: string;
    effects: RecordIdString[];
    order: number;
    isUsingSlot: boolean;
    isActiveByDefault: boolean;
    canDrop: boolean;
    isRollable: boolean;
    description: string;
    type: ItemType;
    price: number;
    expand?: ItemRecordExpand;
} & RecordModel;

export type ItemRecordExpand = { effects: EffectRecord[] };

export type ItemType = 'buff' | 'debuff' | 'neutral' | 'dev';

export const ItemTypeInfo: Record<ItemType, { color: string; label: string }> = {
    buff: { color: 'rgb(45, 194, 107)', label: 'Баф' },
    debuff: { color: 'rgb(224, 62, 45)', label: 'Дебаф' },
    neutral: { color: 'rgb(53, 152, 219)', label: 'Нейтральный' },
    dev: { color: 'rgb(255,106,0)', label: 'Dev' },
};
