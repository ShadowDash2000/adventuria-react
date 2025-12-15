import type { ReactNode } from 'react';
import type { Sort } from '@shared/hook/useSort';
import type {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import type { ClientResponseError, ListResult, RecordModel, RecordService } from 'pocketbase';

export interface CollectionListInfiniteProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    pageSize: number;
    initialSort?: Map<string, Sort>;
    filter?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
    refetchOnWindowFocus?: boolean;
    children: ReactNode;
}

export interface CollectionListInfiniteProviderType<T extends RecordModel> {
    data: InfiniteData<ListResult<T>>;
    isFetching: boolean;
    hasNextPage: boolean;
    fetchNextPage: (
        options?: FetchNextPageOptions | undefined,
    ) => Promise<
        InfiniteQueryObserverResult<InfiniteData<ListResult<T>, unknown>, ClientResponseError>
    >;
    sortSet: (key: string, value: Sort) => void;
    sortIs: (key: string, value: Sort) => boolean;

    sortToggle(key: string): void;
}
