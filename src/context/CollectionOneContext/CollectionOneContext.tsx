import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { ClientResponseError, RecordModel } from 'pocketbase';
import NotFound from '@components/pages/404';
import { CollectionOneContext, CollectionOneProviderProps } from '.';

export const CollectionOneProvider = <T extends RecordModel>({
    collection,
    recordId,
    children,
}: CollectionOneProviderProps<T>) => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: [collection.collectionIdOrName, recordId],
        queryFn: async () => await collection.getOne<T>(recordId),
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
        <CollectionOneContext.Provider value={{ data }}>{children}</CollectionOneContext.Provider>
    );
};
