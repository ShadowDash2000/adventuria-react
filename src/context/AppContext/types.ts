import type { ReactNode } from 'react';
import type PocketBase from 'pocketbase';
import type { UserRecord } from '@shared/types/user';

type AppContextBase = {
    pb: PocketBase;
    availableActions: string[];
    login: () => void;
    logout: () => void;
};

export type AppContextAuth = AppContextBase & { isAuth: true; user: UserRecord };

export type AppContextGuest = AppContextBase & { isAuth: false; user: null };

export type AppProviderType = AppContextAuth | AppContextGuest;

export type AppContextProviderProps = { children: ReactNode };
