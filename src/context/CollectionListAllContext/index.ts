import { createContext, useContext, type Context } from 'react';
import type { RecordModel } from 'pocketbase';
import type { CollectionListAllProviderType } from '@context/CollectionListAllContext/types';

export const CollectionListAllContext = createContext(
    {} as CollectionListAllProviderType<RecordModel>,
);

export const useCollectionListAll = <T extends RecordModel>() =>
    useContext<CollectionListAllProviderType<T>>(
        CollectionListAllContext as unknown as Context<CollectionListAllProviderType<T>>,
    );

export * from './types';

export { CollectionListAllProvider } from './CollectionListAllContext';
