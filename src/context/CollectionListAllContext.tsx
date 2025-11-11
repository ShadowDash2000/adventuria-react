import type {Context, ReactNode} from "react";
import {useContext, createContext} from "react";
import {useQuery} from "@tanstack/react-query";
import {LuLoader} from "react-icons/lu";
import {Text} from "@chakra-ui/react";
import type {RecordModel, RecordService} from "pocketbase";
import type {ClientResponseError} from "pocketbase";
import NotFound from "../components/pages/404";
import {Sort, useSort} from "@shared/hook/useSort";

interface CollectionListAllProviderProps<T extends RecordModel> {
    collection: RecordService<T>
    initialSort?: Map<string, Sort>
    filter?: string
    expand?: string
    fields?: string
    skipTotal?: boolean
    children: ReactNode
}

interface CollectionListAllProviderType<T extends RecordModel> {
    data: T[]
    sortSet: (key: string, value: Sort) => void
    sortIs: (key: string, value: Sort) => boolean

    sortToggle(key: string): void
}

export const CollectionListAllContext = createContext({} as CollectionListAllProviderType<RecordModel>);

export const CollectionListAllProvider = <T extends RecordModel>(
    {
        collection,
        initialSort,
        filter = '',
        expand = '',
        fields = '',
        skipTotal = false,
        children,
    }: CollectionListAllProviderProps<T>
) => {
    const {sortSet, sortIs, sortBuild, sortToggle} = useSort({initial: initialSort});
    const {isPending, isError, data, error} = useQuery({
        queryKey: [
            collection.collectionIdOrName,
            sortBuild,
            filter,
            expand,
            fields,
            skipTotal,
        ],
        queryFn: async () => await collection.getFullList<T>({
            sort: sortBuild,
            filter,
            expand,
            fields,
            skipTotal,
        }),
        retry: (failureCount, e: any) => {
            const error = e as ClientResponseError;
            if (error.status === 404) return false;
            return failureCount < 10;
        },
    });

    if (isPending) {
        return <LuLoader/>
    }

    if (isError) {
        const e = error as ClientResponseError;
        if (e.status === 404) return <NotFound/>;

        return <Text>Error: {error.message}</Text>
    }

    return <CollectionListAllContext.Provider value={{
        data,
        sortSet,
        sortIs,
        sortToggle,
    }}>
        {children}
    </CollectionListAllContext.Provider>
}

export const useCollectionListAll = <T extends RecordModel>() => useContext<CollectionListAllProviderType<T>>((CollectionListAllContext as unknown) as Context<CollectionListAllProviderType<T>>);