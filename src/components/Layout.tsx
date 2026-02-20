import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Box, Flex } from '@chakra-ui/react';
import { Toaster } from '@ui/toaster';
import { useWheelIncrease } from '@components/notifications/wheel-increase';
import { type Theme, useSettingsStore } from '@components/settings/useSettingsStore';
import { type ReactNode } from 'react';
import { ItemDetailsDialog } from '@components/items/ItemDetailsDialog';

const themes: Record<Theme, ReactNode | null> = {
    disabled: null,
    white: (
        <Box
            position="fixed"
            top={0}
            left={0}
            w="full"
            h="full"
            pointerEvents="none"
            opacity={0.2}
            bgColor="white"
            WebkitMaskImage='url("/games.svg")'
            WebkitMaskSize="450px auto"
        />
    ),
    blue: (
        <Box
            position="fixed"
            top={0}
            left={0}
            w="full"
            h="full"
            pointerEvents="none"
            bgGradient="{gradients.psone}"
            WebkitMaskImage='url("/games.svg")'
            WebkitMaskSize="450px auto"
        />
    ),
};

const Layout = () => {
    useWheelIncrease();
    const theme = useSettingsStore(state => state.theme);

    return (
        <>
            <Header />
            <Flex as="main" justify="center" w="100%" overflowX="hidden" p="0" m="0">
                {themes[theme]}
                <Box maxW="vw">
                    <Outlet />
                </Box>
            </Flex>
            <ScrollRestoration />
            <Toaster />
            <ItemDetailsDialog />
        </>
    );
};

export default Layout;
