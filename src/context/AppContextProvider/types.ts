import PocketBase from "pocketbase";
import type {Dispatch, ReactNode, SetStateAction} from "react";
import {UserRecord} from "@shared/types/user";

export type AppProviderType = {
    pb: PocketBase
    isAuth: boolean
    user: UserRecord | null
    setUser: Dispatch<SetStateAction<UserRecord>>;
}

export type AppContextProviderProps = {
    children: ReactNode
}
