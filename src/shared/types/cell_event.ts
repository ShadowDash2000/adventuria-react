import type { IsoDateString, RecordIdString } from '@shared/types/pocketbase';
import type { RecordModel } from 'pocketbase';

export type CellEventRecord = {
    created: IsoDateString;
    updated: IsoDateString;
    action_event: RecordIdString;
    effects: RecordIdString[];
    active_cell: RecordIdString;
    cell_types: string;
    worlds: RecordIdString[];
    shift_interval: number;
    last_shift: IsoDateString;
    colors: string;
    description: string;
} & RecordModel;
