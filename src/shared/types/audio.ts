import type {RecordModel} from "pocketbase";
import type {IsoDateString} from "@shared/types/pocketbase";

export type AudioRecord = {
    created: IsoDateString
    updated: IsoDateString
    name: string
    audio: string
    duration: number
} & RecordModel