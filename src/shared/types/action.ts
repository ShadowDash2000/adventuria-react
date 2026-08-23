import type { RecordModel } from 'pocketbase';
import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { ActivityRecord } from '@shared/types/activity';
import type { PlayerRecord } from '@shared/types/player';
import type { CellRecord } from '@shared/types/cell';
import type { ReviewRecord } from '@shared/types/review';

export type ActionRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    player: RecordIdString;
    cell: RecordIdString;
    status: string;
    activity: RecordIdString;
    review: RecordIdString;
    cells_passed: number;
    state?: ActionState;
    expand?: ActionRecordExpand;
} & RecordModel;

export type ActionRecordExpand = {
    player: PlayerRecord;
    cell: CellRecord;
    activity?: ActivityRecord;
    review?: ReviewRecord;
};

type ActionState = { used_items?: UsedItemState[] };

type UsedItemState = { id: string };
