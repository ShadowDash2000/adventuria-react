import type {AuthRecord} from "pocketbase";
import {IsoDateString} from "@shared/types/pocketbase";

export type UserRecord = {
    created: IsoDateString
    updated: IsoDateString
    name: string
    avatar?: string
} & AuthRecord