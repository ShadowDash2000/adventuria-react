import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActivityRecord } from '@shared/types/activity';
import type { PlayerRecord } from '@shared/types/player';
import type { CellRecord } from '@shared/types/cell';

export type ActionRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    cell: RecordIdString;
    type: string;
    activity: RecordIdString;
    comment: string;
    cells_passed: number;
    items_list: string[];
    used_items: string[];
    can_move: boolean;
    custom_activity_filter: unknown;
    expand?: ActionRecordExpand;
} & RecordModel;

export type ActionRecordExpand = {
    player: PlayerRecord;
    cell: CellRecord;
    activity?: ActivityRecord;
};
