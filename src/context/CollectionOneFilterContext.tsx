import { type Context, createContext, type ReactNode, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { ClientResponseError, RecordModel, RecordService } from 'pocketbase';
import NotFound from '../components/pages/404';

interface CollectionOneFilterProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    filter?: string;
    children: ReactNode;
}

interface CollectionOneFilterProviderType<T extends RecordModel> {
    data: T;
}

export const CollectionOneFilterContext = createContext(
    {} as CollectionOneFilterProviderType<RecordModel>,
);

export const CollectionOneFilterProvider = <T extends RecordModel>({
    collection,
    filter = '',
    children,
}: CollectionOneFilterProviderProps<T>) => {
    const { isPending, isError, data, error } = useQuery({
        queryKey: [collection.collectionIdOrName, filter],
        queryFn: async () => await collection.getFirstListItem<T>(filter),
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
        <CollectionOneFilterContext.Provider value={{ data }}>
            {children}
        </CollectionOneFilterContext.Provider>
    );
};

export const useCollectionOneFilter = <T extends RecordModel>() =>
    useContext<CollectionOneFilterProviderType<T>>(
        CollectionOneFilterContext as unknown as Context<CollectionOneFilterProviderType<T>>,
    );
