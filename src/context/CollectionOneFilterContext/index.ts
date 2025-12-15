import { type Context, createContext, useContext } from 'react';
import type { RecordModel } from 'pocketbase';
import type { CollectionOneFilterProviderType } from './types';

export const CollectionOneFilterContext = createContext(
    {} as CollectionOneFilterProviderType<RecordModel>,
);

export const useCollectionOneFilter = <T extends RecordModel>() =>
    useContext<CollectionOneFilterProviderType<T>>(
        CollectionOneFilterContext as unknown as Context<CollectionOneFilterProviderType<T>>,
    );

export * from './types';

export { CollectionOneFilterProvider } from './CollectionOneFilterContext';
