import type { RecordIdString } from '@shared/types/pocketbase';
import type { ItemType } from '@shared/types/item';

export type ItemView = {
    id: RecordIdString;
    collectionName: string;
    name: string;
    icon: string;
    description: string;
    type: ItemType;
};
