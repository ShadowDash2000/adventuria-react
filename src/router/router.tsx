import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
    {
        path: '/',
        async lazy() {
            const { Layout } = await import('../components/Layout');
            return { Component: Layout };
        },
        children: [
            {
                index: true,
                async lazy() {
                    const { Main } = await import('../components/pages/Main');
                    return { Component: Main };
                },
            },
            {
                path: '/profile/:login',
                async lazy() {
                    const { Profile } = await import('../components/pages/Profile');
                    return { Component: Profile };
                },
            },
        ],
    },
    {
        path: '/timer/:userId',
        async lazy() {
            const { Timer } = await import('../components/pages/Timer');
            return { Component: Timer };
        },
    },
]);
