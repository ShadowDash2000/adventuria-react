import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useMemo, useState,} from "react";
import PocketBase, {ClientResponseError} from "pocketbase";
import type {UserRecord} from "@shared/types/user";
import {type QueryObserverResult, useQuery} from "@tanstack/react-query";

export type AppProviderType = {
    pb: PocketBase
    isAuth: boolean
    user: UserRecord | null
    setUser: Dispatch<SetStateAction<UserRecord>>
    availableActions: string[]
    logout: () => void
    refetchActions: () => Promise<QueryObserverResult<string[], Error>>
}

export type AppContextProviderProps = {
    children: ReactNode
}

const AppContext = createContext<AppProviderType>({} as AppProviderType);

export const AppContextProvider = ({children}: AppContextProviderProps) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const [user, setUser] = useState(pb.authStore.record as UserRecord);
    const [isAuth, setIsAuth] = useState<boolean>(pb.authStore.isValid);
    const [availableActions, setAvailableActions] = useState<string[]>([]);
    const logout = () => {
        pb.authStore.clear();
        setUser(pb.authStore.record as UserRecord);
        setIsAuth(false);
    }

    const {
        refetch: refetchActions,
    } = useQuery({
        queryKey: ['available-actions'],
        queryFn: async () => {
            const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/available-actions`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${pb.authStore.token}`,
                },
            });

            if (!res.ok) {
                throw await res.json().catch(() => {
                    return new ClientResponseError({
                        status: res.status,
                    });
                });
            }

            const data: string[] = await res.json();
            setAvailableActions(data);
            return data;
        },
        retry: (failureCount, e) => {
            const error = e as ClientResponseError;
            if (error.status === 401) return false;
            return failureCount < 10;
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (pb.authStore.isValid) {
            pb.collection('users').authRefresh();

            setUser(pb.authStore.record as UserRecord);
        } else {
            pb.authStore.clear();
        }
    }, []);

    useEffect(() => {
        setIsAuth(pb.authStore.isValid);
    }, [user]);

    return <AppContext.Provider value={{
        pb,
        user,
        setUser,
        logout,
        isAuth,
        availableActions,
        refetchActions,
    }}>
        {children}
    </AppContext.Provider>;
}

export const useAppContext: () => AppProviderType = () => useContext(AppContext);