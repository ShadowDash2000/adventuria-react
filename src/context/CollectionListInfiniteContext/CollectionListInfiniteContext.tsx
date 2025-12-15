import type { InfiniteData } from '@tanstack/react-query';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { ListResult, RecordModel } from 'pocketbase';
import { useSort } from '@shared/hook/useSort';
import type { ClientResponseError } from 'pocketbase';
import NotFound from '@components/pages/404';
import { CollectionListInfiniteContext, CollectionListInfiniteProviderProps } from '.';

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
        useInfiniteQuery<
            ListResult<T>,
            ClientResponseError,
            InfiniteData<ListResult<T>>,
            readonly unknown[],
            number
        >({
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
            retry: (failureCount, e: unknown) => {
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

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <CollectionListInfiniteContext.Provider
            value={{ data, isFetching, hasNextPage, fetchNextPage, sortSet, sortIs, sortToggle }}
        >
            {children}
        </CollectionListInfiniteContext.Provider>
    );
};
