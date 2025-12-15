import type { Context, ReactNode } from 'react';
import { useContext, createContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';
import type { ListResult, RecordModel, RecordService, ClientResponseError } from 'pocketbase';
import NotFound from '../components/pages/404';

interface CollectionListProviderProps<T extends RecordModel> {
    collection: RecordService<T>;
    page?: number;
    pageSize: number;
    filter?: string;
    expand?: string;
    fields?: string;
    skipTotal?: boolean;
    children: ReactNode;
}

interface CollectionListProviderType<T extends RecordModel> {
    data: ListResult<T>;
}

export const CollectionListContext = createContext({} as CollectionListProviderType<RecordModel>);

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
        <CollectionListContext.Provider value={{ data }}>{children}</CollectionListContext.Provider>
    );
};

export const useCollectionList = <T extends RecordModel>() =>
    useContext<CollectionListProviderType<T>>(
        CollectionListContext as unknown as Context<CollectionListProviderType<T>>,
    );
