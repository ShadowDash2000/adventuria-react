import type { RecordModel, RecordService } from 'pocketbase';
import type { Sort } from '@shared/hook/useSort';
import type { ReactNode } from 'react';

export interface CollectionListAllProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    initialSort?: Map<string, Sort>;
    filter?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
    refetchOnWindowFocus?: boolean;
    children: ReactNode;
}

export interface CollectionListAllProviderType<T extends RecordModel> {
    data: T[];
    sortSet: (key: string, value: Sort) => void;
    sortIs: (key: string, value: Sort) => boolean;

    sortToggle(key: string): void;
}
