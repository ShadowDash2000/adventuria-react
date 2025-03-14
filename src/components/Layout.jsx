import {Outlet} from "react-router-dom";
import {Header} from "./Header.jsx";
import {AppContextProvider} from "../context/AppContextProvider.jsx";
import {ModalContextProvider} from "../context/ModalContextProvider.jsx";

export const Layout = () => {
    return (
        <AppContextProvider>
            <ModalContextProvider>
                <Header/>
                <main>
                    <Outlet/>
                </main>
            </ModalContextProvider>
        </AppContextProvider>
    )
}