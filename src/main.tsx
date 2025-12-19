import './main.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { ChakraProvider, createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';
import { AppContextProvider } from '@context/AppContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@shared/queryClient';
import { ThemeProvider } from 'next-themes';

const colorModeConfig = { forcedTheme: 'dark' };
const themeConfig = defineConfig({
    globalCss: { body: { fontSize: 'sm' } },
    theme: {
        semanticTokens: { colors: { bg: { panel: { value: '#303e54' } } } },
        tokens: {
            fonts: {
                body: { value: 'PlayStation, system-ui' },
                heading: { value: 'PlayStation, system-ui' },
            },
            fontSizes: {
                '2xs': { value: '0.625rem' },
                xs: { value: '0.75rem' },
                sm: { value: '0.975rem' },
                md: { value: '1rem' },
                lg: { value: '1.125rem' },
                xl: { value: '2.25rem' },
                '2xl': { value: '2.5rem' },
                '3xl': { value: '2.875rem' },
                '4xl': { value: '3.25rem' },
                '5xl': { value: '3rem' },
                '6xl': { value: '3.75rem' },
                '7xl': { value: '4.5rem' },
            },
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

createRoot(document.getElementById('root')!).render(
    <ChakraProvider value={system}>
        <ThemeProvider attribute="class" disableTransitionOnChange {...colorModeConfig} />
        <QueryClientProvider client={queryClient}>
            <AppContextProvider>
                <RouterProvider router={router} />
            </AppContextProvider>
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
        </QueryClientProvider>
    </ChakraProvider>,
);
