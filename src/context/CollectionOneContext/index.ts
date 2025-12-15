import { type Context, createContext, useContext } from 'react';
import type { CollectionOneProviderType } from '@context/CollectionOneContext/types';
import type { RecordModel } from 'pocketbase';

export const CollectionOneContext = createContext({} as CollectionOneProviderType<RecordModel>);

export const useCollectionOne = <T extends RecordModel>() =>
    useContext<CollectionOneProviderType<T>>(
        CollectionOneContext as unknown as Context<CollectionOneProviderType<T>>,
    );

export * from './types';

export { CollectionOneProvider } from './CollectionOneContext';
