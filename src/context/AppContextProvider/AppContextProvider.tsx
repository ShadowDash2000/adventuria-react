import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import PocketBase, { ClientResponseError } from 'pocketbase';
import type { UserRecord } from '@shared/types/user';
import { type QueryObserverResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { type AudioPlayer, useAudio } from '@shared/hook/useAudio';

export type AppProviderType = {
    pb: PocketBase;
    isAuth: boolean;
    user: UserRecord | null;
    setUser: Dispatch<SetStateAction<UserRecord>>;
    availableActions: string[];
    logout: () => void;
    refetchActions: () => Promise<QueryObserverResult<string[], Error>>;
    audioActions: AudioPlayer;
};

export type AppContextProviderProps = { children: ReactNode };

const AppContext = createContext<AppProviderType>({} as AppProviderType);

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const queryClient = useQueryClient();
    const [user, setUser] = useState(pb.authStore.record as UserRecord);
    const [isAuth, setIsAuth] = useState<boolean>(pb.authStore.isValid);
    const logout = () => {
        pb.authStore.clear();
        setUser(pb.authStore.record as UserRecord);
        setIsAuth(false);
    };

    const { data: availableActions = [], refetch: refetchActionsRaw } = useQuery({
        queryFn: async () => await fetchAvailableActions(pb.authStore.token),
        enabled: isAuth,
        queryKey: ['available-actions', isAuth],
        refetchOnWindowFocus: false,
    });

    const refetchActions = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: ['actions'] });
        return refetchActionsRaw();
    }, [queryClient, refetchActionsRaw]);

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

    const audioActions = useAudio('volume-actions', 0.1);

    return (
        <AppContext.Provider
            value={{
                pb,
                user,
                setUser,
                logout,
                isAuth,
                availableActions,
                refetchActions,
                audioActions,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext: () => AppProviderType = () => useContext(AppContext);

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
