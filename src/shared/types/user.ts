import type {AuthRecord} from "pocketbase";
import type {IsoDateString} from "@shared/types/pocketbase";

export type UserRecord = {
    created: IsoDateString
    updated: IsoDateString
    name: string
    avatar: string
    color: string
    points: number
    cellsPassed: number
    isInJail: boolean
    dropsInARow: number
    maxInventorySlots: number
    itemWheelCount: number
    description: string
    stats: string
    balance: number
} & AuthRecord