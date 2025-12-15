import type { RecordModel, RecordService } from 'pocketbase';
import type { ReactNode } from 'react';

export interface CollectionOneFilterProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    filter?: string;
    children: ReactNode;
}

export interface CollectionOneFilterProviderType<T extends RecordModel> {
    data: T;
}
