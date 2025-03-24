import {useContext, createContext, useMemo, useEffect} from "react";
import PocketBase from "pocketbase";
import {useUsersStore} from "../pocketbase/users.js";

const AppContext = createContext(null);

export const AppContextProvider = ({children}) => {
    const pb = useMemo(() => new PocketBase(import.meta.env.VITE_PB_URL), []);
    const users = useUsersStore();

    useEffect(() => {
        users.setPocketBase(pb);
        users.fetch();
    }, []);

    return <AppContext.Provider value={{pb}}>
        {children}
    </AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);