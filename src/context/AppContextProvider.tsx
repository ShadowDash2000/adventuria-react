import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import PocketBase, { ClientResponseError } from 'pocketbase';
import type { UserRecord } from '@shared/types/user';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';

type AppContextBase = { pb: PocketBase; availableActions: string[]; logout: () => void };

type AppContextAuth = AppContextBase & { isAuth: true; user: UserRecord };

type AppContextGuest = AppContextBase & { isAuth: false; user: null };

type AppProviderType = AppContextAuth | AppContextGuest;

type AppContextProviderProps = { children: ReactNode };

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

const AppContext = createContext<AppProviderType>({
    pb,
    availableActions: [],
    logout: function (): void {
        throw new Error('Function not implemented.');
    },
    isAuth: false,
    user: null,
});

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const [isAuth, setIsAuth] = useState<boolean>(pb.authStore.isValid);
    const logout = () => {
        pb.authStore.clear();
        setIsAuth(false);
    };

    const { data: user = pb.authStore.record as UserRecord } = useQuery({
        queryFn: () => {
            setIsAuth(pb.authStore.isValid);
            return pb.collection('users').getOne<UserRecord>(pb.authStore.record!.id);
        },
        enabled: isAuth,
        queryKey: [...queryKeys.user, isAuth, pb.authStore.record?.id],
        refetchOnWindowFocus: false,
    });

    const { data: availableActions = [] } = useQuery({
        queryFn: async () => await fetchAvailableActions(pb.authStore.token),
        enabled: isAuth,
        queryKey: [...queryKeys.availableActions, isAuth, pb.authStore.token],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (!isAuth) {
            pb.authStore.clear();
        }
    }, []);

    const ctx = {
        pb,
        user: isAuth ? user : null,
        logout,
        isAuth,
        availableActions,
    } as AppProviderType;

    return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
};

export const useAppContext: () => AppProviderType = () => useContext(AppContext);

export const useAppAuthContext = (): AppContextAuth => {
    const ctx = useContext(AppContext);
    if (!ctx.isAuth) {
        throw new Error('useAppAuthContext must be used within an authorized user session');
    }
    return ctx;
};

const fetchAvailableActions = async (authToken: string): Promise<string[]> => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/available-actions`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
    });

    if (!res.ok) {
        throw await res.json().catch(() => {
            return new ClientResponseError({ status: res.status });
        });
    }

    return (await res.json()) as string[];
};
