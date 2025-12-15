import type { AppContextAuth, AppProviderType } from './types';
import { createContext, useContext } from 'react';
import PocketBase from 'pocketbase';

export const pb = new PocketBase(import.meta.env.VITE_PB_URL);

export const AppContext = createContext<AppProviderType>({
    pb,
    availableActions: [],
    login: function (): void {
        throw new Error('Function not implemented.');
    },
    logout: function (): void {
        throw new Error('Function not implemented.');
    },
    isAuth: false,
    user: null,
});

export const useAppContext: () => AppProviderType = () => useContext(AppContext);

export const useAppAuthContext = (): AppContextAuth => {
    const ctx = useContext(AppContext);
    if (!ctx.isAuth) {
        throw new Error('useAppAuthContext must be used within an authorized user session');
    }
    return ctx;
};

export * from './types';

export { AppContextProvider } from './AppContextProvider';
