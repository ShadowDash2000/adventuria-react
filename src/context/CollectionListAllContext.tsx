import type {Context, Dispatch, ReactNode, SetStateAction,} from "react";
import {useContext, useState, createContext} from "react";
import {useQuery} from "@tanstack/react-query";
import {LuLoader} from "react-icons/lu";
import {Text} from "@chakra-ui/react";
import type {ListOptions, RecordModel, RecordService} from "pocketbase";
import type {ClientResponseError} from "pocketbase";
import NotFound from "../components/pages/404";

interface CollectionListAllProviderProps<T extends RecordModel> {
    collection: RecordService<T>
    filter?: string
    expand?: string
    fields?: string
    skipTotal?: boolean
    children: ReactNode
}

interface CollectionListAllProviderType<T extends RecordModel> {
    data: T[]
}

export const CollectionListAllContext = createContext({} as CollectionListAllProviderType<RecordModel>);

export const CollectionListAllProvider = <T extends RecordModel>(
    {
        collection,
        filter = '',
        expand = '',
        fields = '',
        skipTotal = false,
        children,
    }: CollectionListAllProviderProps<T>
) => {
    const {isPending, isError, data, error} = useQuery({
        queryKey: [
            collection.collectionIdOrName,
            filter,
            expand,
            fields,
            skipTotal,
        ],
        queryFn: async () => await collection.getFullList<T>({
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
    }}>
        {children}
    </CollectionListAllContext.Provider>
}

export const useCollectionListAll = <T extends RecordModel>() => useContext<CollectionListAllProviderType<T>>((CollectionListAllContext as unknown) as Context<CollectionListAllProviderType<T>>);