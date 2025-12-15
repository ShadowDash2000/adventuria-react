import type { ReactNode } from 'react';
import type { ListResult, RecordModel, RecordService } from 'pocketbase';

export interface CollectionListProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    page?: number;
    pageSize: number;
    filter?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
    children: ReactNode;
}

export interface CollectionListProviderType<T extends RecordModel> {
    data: ListResult<T>;
}
