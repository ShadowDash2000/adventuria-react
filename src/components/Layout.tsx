import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header } from './Header';
import { Flex } from '@chakra-ui/react';
import { Toaster } from '@ui/toaster';
import { useWheelIncrease } from '@components/notifications/wheel-increase';

const Layout = () => {
    useWheelIncrease();

    return (
        <>
            <Header />
            <Flex as="main" justify="center" w="100%" overflowX="hidden" p="0" m="0">
                <Outlet />
            </Flex>
            <ScrollRestoration />
            <Toaster />
        </>
    );
};

export default Layout;
