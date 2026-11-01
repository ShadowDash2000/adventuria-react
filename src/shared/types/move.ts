import type { RecordIdString } from '@shared/types/pocketbase';

export type Move = {
    type: string;
    world_id: RecordIdString;
    cell_local_order: number;
    cell_global_order: number;
    steps: number;
    total_steps: number;
    prev_total_steps: number;
};
