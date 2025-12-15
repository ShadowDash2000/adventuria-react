import { type Context, createContext, useContext } from 'react';
import type { RecordModel } from 'pocketbase';
import type { CollectionListInfiniteProviderType } from './types';

export const CollectionListInfiniteContext = createContext(
    {} as CollectionListInfiniteProviderType<RecordModel>,
);

export const useCollectionListInfinite = <T extends RecordModel>() =>
    useContext<CollectionListInfiniteProviderType<T>>(
        CollectionListInfiniteContext as unknown as Context<CollectionListInfiniteProviderType<T>>,
    );

export * from './types';

export { CollectionListInfiniteProvider } from './CollectionListInfiniteContext';
