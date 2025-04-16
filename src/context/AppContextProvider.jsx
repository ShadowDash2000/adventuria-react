import {useContext, createContext, useMemo, useEffect, useState} from "react";
import PocketBase from "pocketbase";

const AppContext = createContext(null);

export const AppContextProvider = ({children}) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (pb.authStore.isValid) {
            pb.collection('users').authRefresh();
            setUser(pb.authStore.record);
        } else {
            pb.authStore.clear();
        }
    }, []);

    return <AppContext.Provider value={{pb, user, setUser}}>
        {children}
    </AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);