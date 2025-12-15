import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { RecordModel, ClientResponseError } from 'pocketbase';
import NotFound from '@components/pages/404';
import { CollectionListProviderProps, CollectionListContext } from '.';

export const CollectionListProvider = <T extends RecordModel>({
    collection,
    page = 1,
    pageSize,
    filter = '',
    expand = '',
    fields = '',
    skipTotal = false,
    children,
}: CollectionListProviderProps<T>) => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: [collection.collectionIdOrName, page, filter, expand, fields, skipTotal],
        queryFn: async () =>
            await collection.getList<T>(page, pageSize, { filter, expand, fields, skipTotal }),
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
        <CollectionListContext.Provider value={{ data }}>{children}</CollectionListContext.Provider>
    );
};
