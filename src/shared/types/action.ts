import type {RecordModel} from "pocketbase";
import {IsoDateString} from "@shared/types/pocketbase";

export type ActionRecord = {
    created: IsoDateString
    updated: IsoDateString
    name: string
    avatar?: string
} & RecordModel