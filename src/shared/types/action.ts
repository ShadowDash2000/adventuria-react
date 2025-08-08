import type {RecordModel} from "pocketbase";
import {IsoDateString, RecordIdString} from "@shared/types/pocketbase";

export type ActionRecord = {
    created: IsoDateString
    updated: IsoDateString
    user: RecordIdString
    cell: RecordIdString
    type: string
    value: string
    comment: string
} & RecordModel