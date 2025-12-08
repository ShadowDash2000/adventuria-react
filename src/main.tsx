import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import './main.css';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { ColorModeProvider } from '@ui/color-mode';
import { AppContextProvider } from '@context/AppContextProvider/AppContextProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const colorModeConfig = { forcedTheme: 'dark' };
const themeConfig = defineConfig({
    theme: {
        semanticTokens: { colors: { bg: { panel: { value: '#303e54' } } } },
        tokens: {
            zIndex: { dropdown: { value: 1600 } },
            colors: {
                red: { DEFAULT: { value: '#B62F28' }, hover: { value: '#E93F36' } },
                blue: { DEFAULT: { value: '#3E8CA5' }, hover: { value: '#49a7c6' } },
                green: { DEFAULT: { value: '#4EA35B' }, hover: { value: '#5dc66d' } },
                orange: { DEFAULT: { value: '#F19C42' }, hover: { value: '#ffb544' } },
                purple: { DEFAULT: { value: '#873ea5' }, hover: { value: '#a149c6' } },
            },
        },
    },
});
const system = createSystem(defaultConfig, themeConfig);
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <ChakraProvider value={system}>
        <ColorModeProvider {...colorModeConfig} />
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <RouterProvider router={router} />
            </AppContextProvider>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </QueryClientProvider>
    </ChakraProvider>,
);
