import type {RecordModel} from "pocketbase";
import type {IsoDateString} from "@shared/types/pocketbase";

export type PlatformRecord = {
    created: IsoDateString
    updated: IsoDateString
    id_db: number
    name: string
    checksum: string
} & RecordModel