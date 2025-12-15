import { type Context, createContext, useContext } from 'react';
import type { RecordModel } from 'pocketbase';
import type { CollectionListProviderType } from './types';

export const CollectionListContext = createContext({} as CollectionListProviderType<RecordModel>);

export const useCollectionList = <T extends RecordModel>() =>
    useContext<CollectionListProviderType<T>>(
        CollectionListContext as unknown as Context<CollectionListProviderType<T>>,
    );

export * from './types';

export { CollectionListProvider } from './CollectionListContext';
