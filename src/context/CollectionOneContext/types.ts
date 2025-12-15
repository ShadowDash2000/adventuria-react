import type { ReactNode } from 'react';
import type { RecordModel, RecordService } from 'pocketbase';

export interface CollectionOneProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    recordId: string;
    children: ReactNode;
}

export interface CollectionOneProviderType<T extends RecordModel> {
    data: T;
}
