import {Outlet} from "react-router-dom";
import {Header} from "./Header.jsx";
import {AppContextProvider} from "../context/AppContextProvider.jsx";
import {defaultConfig, defineConfig, createSystem, ChakraProvider} from "@chakra-ui/react";
import {ColorModeProvider} from "./ui/color-mode.jsx";

export const Layout = () => {
    const colorModeConfig = {
        forcedTheme: 'dark',
    };

    const themeConfig = defineConfig({
        theme: {
            semanticTokens: {
                colors: {
                    bg: {
                        panel: {value: '#303e54'},
                    },
                },
            },
        },
    })

    const system = createSystem(defaultConfig, themeConfig);

    return (
        <ChakraProvider value={system}>
            <ColorModeProvider {...colorModeConfig} />
            <AppContextProvider>
                <Header/>
                <main>
                    <Outlet/>
                </main>
            </AppContextProvider>
        </ChakraProvider>
    )
}