import type {RecordModel} from "pocketbase";
import type {IsoDateString} from "@shared/types/pocketbase";

export type SettingsRecord = {
    created: IsoDateString
    updated: IsoDateString
    eventDateStart: IsoDateString
    currentWeek?: number
    timerTimeLimit: number
    limitExceedPenalty: number
    blockAllActions: boolean
    pointsForDrop: number
    dropsToJail: number
    rules?: string
} & RecordModel