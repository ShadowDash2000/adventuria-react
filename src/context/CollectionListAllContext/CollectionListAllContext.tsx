import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { RecordModel } from 'pocketbase';
import type { ClientResponseError } from 'pocketbase';
import NotFound from '@components/pages/404';
import { useSort } from '@shared/hook/useSort';
import { CollectionListAllProviderProps } from './types';
import { CollectionListAllContext } from '.';

export const CollectionListAllProvider = <T extends RecordModel>({
    collection,
    initialSort,
    filter = '',
    expand = '',
    fields = '',
    skipTotal = false,
    refetchOnWindowFocus = true,
    children,
}: CollectionListAllProviderProps<T>) => {
    const { sortSet, sortIs, sortBuild, sortToggle } = useSort({ initial: initialSort });
    const { isPending, isError, data, error } = useQuery({
        queryKey: [collection.collectionIdOrName, sortBuild, filter, expand, fields, skipTotal],
        queryFn: async () =>
            await collection.getFullList<T>({ sort: sortBuild, filter, expand, fields, skipTotal }),
        refetchOnWindowFocus: refetchOnWindowFocus,
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
        <CollectionListAllContext.Provider value={{ data, sortSet, sortIs, sortToggle }}>
            {children}
        </CollectionListAllContext.Provider>
    );
};
