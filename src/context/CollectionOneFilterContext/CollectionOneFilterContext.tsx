import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import type { ClientResponseError, RecordModel } from 'pocketbase';
import NotFound from '@components/pages/404';
import { CollectionOneFilterContext, CollectionOneFilterProviderProps } from '.';

export const CollectionOneFilterProvider = <T extends RecordModel>({
    collection,
    filter = '',
    children,
}: CollectionOneFilterProviderProps<T>) => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: [collection.collectionIdOrName, filter],
        queryFn: async () => await collection.getFirstListItem<T>(filter),
        retry: (failureCount, e: unknown) => {
            const error = e as ClientResponseError;
            if (error.status === 404) return false;
            return failureCount < 10;
        },
    });

    if (isPending) {
        return <Spinner />;
    }

    if (isError) {
        const e = error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <CollectionOneFilterContext.Provider value={{ data }}>
            {children}
        </CollectionOneFilterContext.Provider>
    );
};
