import {useContext, createContext, useMemo, useEffect, useState} from "react";
import PocketBase from "pocketbase";
import {useUsersStore} from "../pocketbase/users.js";

const AppContext = createContext(null);

export const AppContextProvider = ({children}) => {
    const pb = useMemo(() => new PocketBase('http://127.0.0.1:8090/'), []);
    const users = useUsersStore();

    useEffect(() => {
        users.setPocketBase(pb);
        users.fetch();
    }, []);

    return <AppContext.Provider value={{users}}>
        {children}
    </AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);