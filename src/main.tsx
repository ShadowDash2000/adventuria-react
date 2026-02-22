import './main.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { ChakraProvider } from '@chakra-ui/react';
import { AppContextProvider } from '@context/AppContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@shared/queryClient';
import { ThemeProvider } from 'next-themes';
import theme, { colorModeConfig } from './theme/theme';
import UmamiAnalytics from '@danielgtmn/umami-react';

createRoot(document.getElementById('root')!).render(
    <>
        <UmamiAnalytics
            url={import.meta.env.VITE_UMAMI_URL}
            websiteId={import.meta.env.VITE_UMAMI_WEBSITE_ID}
            debug={import.meta.env.VITE_UMAMI_DEBUG === 'true'}
            lazyLoad
        />
        <ChakraProvider value={theme}>
            <ThemeProvider attribute="class" disableTransitionOnChange {...colorModeConfig} />
            <QueryClientProvider client={queryClient}>
                <AppContextProvider>
                    <RouterProvider router={router} />
                </AppContextProvider>
                <ReactQueryDevtools initialIsOpen={false} buttonPosition="top-left" />
            </QueryClientProvider>
        </ChakraProvider>
    </>,
);
