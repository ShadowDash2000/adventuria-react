import type {RecordModel} from "pocketbase";
import type {IsoDateString, RecordIdString} from "@shared/types/pocketbase";
import type {GameRecord} from "@shared/types/game";
import type {UserRecord} from "@shared/types/user";
import type {CellRecord} from "@shared/types/cell";

export type ActionRecord = {
    created: IsoDateString
    updated: IsoDateString
    user: RecordIdString
    cell: RecordIdString
    type: string
    game: RecordIdString
    comment: string
    diceRoll: number
    items_list: string[]
    can_move: boolean
    game_filter: unknown
    expand?: ActionRecordExpand
} & RecordModel

export type ActionRecordExpand = {
    user: UserRecord
    cell: CellRecord
    game?: GameRecord
}