import type {RecordModel} from "pocketbase";
import type {IsoDateString, RecordIdString} from "@shared/types/pocketbase";
import {EffectRecord} from "@shared/types/effect";

export type ItemRecord = {
    created: IsoDateString
    updated: IsoDateString
    name: string
    icon: string
    effects: RecordIdString[]
    order: number
    isUsingSlot: boolean
    isActiveByDefault: boolean
    canDrop: boolean
    isRollable: boolean
    description: string
    type: ItemType
    price: number
    expand?: ItemRecordExpand
} & RecordModel

export type ItemRecordExpand = {
    effects: EffectRecord[]
}

type ItemType = 'buff' | 'debuff';