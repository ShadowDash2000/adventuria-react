import type { Context, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type {
    FetchNextPageOptions,
    InfiniteData,
    InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { ListResult, RecordModel, RecordService } from 'pocketbase';
import { Sort, useSort } from '@shared/hook/useSort';
import type { ClientResponseError } from 'pocketbase';
import NotFound from '../components/pages/404';

interface CollectionListInfiniteProviderProps<T extends RecordModel> {
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

interface CollectionListInfiniteProviderType<T extends RecordModel> {
    data: InfiniteData<ListResult<T>>;
    isFetching: boolean;
    hasNextPage: boolean;
    fetchNextPage: (
        options?: FetchNextPageOptions | undefined,
    ) => Promise<InfiniteQueryObserverResult<InfiniteData<ListResult<T>, unknown>, Error>>;
    sortSet: (key: string, value: Sort) => void;
    sortIs: (key: string, value: Sort) => boolean;

    sortToggle(key: string): void;
}

export const CollectionListInfiniteContext = createContext(
    {} as CollectionListInfiniteProviderType<RecordModel>,
);

export const CollectionListInfiniteProvider = <T extends RecordModel>({
    collection,
    pageSize,
    initialSort,
    filter = '',
    expand = '',
    fields = '',
    skipTotal = false,
    refetchOnWindowFocus = true,
    children,
}: CollectionListInfiniteProviderProps<T>) => {
    const { sortSet, sortIs, sortBuild, sortToggle } = useSort({ initial: initialSort });
    const { fetchNextPage, isPending, isError, isFetching, hasNextPage, data, error } =
        useInfiniteQuery({
            queryKey: [collection.collectionIdOrName, sortBuild, filter, expand, fields, skipTotal],
            placeholderData: keepPreviousData,
            queryFn: async ({ pageParam }) => {
                return await collection.getList<T>(pageParam, pageSize, {
                    sort: sortBuild,
                    filter,
                    expand,
                    fields,
                    skipTotal,
                });
            },
            initialPageParam: 1,
            refetchOnWindowFocus: refetchOnWindowFocus,
            getNextPageParam: (lastPage, _allPages, lastPageParam) => {
                if (lastPage.page === lastPage.totalPages) return null;
                return ++lastPageParam;
            },
            retry: (failureCount, e: any) => {
                const error = e as ClientResponseError;
                if (error.status === 404) return false;
                return failureCount < 10;
            },
        });

    if (isPending) {
        return <LuLoader />;
    }

    if (isError) {
        const e = error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {error.message}</Text>;
    }

    return (
        <CollectionListInfiniteContext.Provider
            value={{ data, isFetching, hasNextPage, fetchNextPage, sortSet, sortIs, sortToggle }}
        >
            {children}
        </CollectionListInfiniteContext.Provider>
    );
};

export const useCollectionListInfinite = <T extends RecordModel>() =>
    useContext<CollectionListInfiniteProviderType<T>>(
        CollectionListInfiniteContext as unknown as Context<CollectionListInfiniteProviderType<T>>,
    );
