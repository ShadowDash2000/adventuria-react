import { createBrowserRouter } from 'react-router-dom';
import { type CSSProperties, lazy, Suspense } from 'react';
import { LuLoader } from 'react-icons/lu';

const Layout = lazy(() => import('@components/Layout'));
const Main = lazy(() => import('@components/pages/Main'));
const Profile = lazy(() => import('@components/pages/Profile'));
const Timer = lazy(() => import('@components/pages/Timer'));

const loaderStyle = {
    position: 'fixed',
    left: '50%',
    top: '10%',
    transform: 'translate(-50%,-10%)',
} as CSSProperties;

export const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <Suspense fallback={<LuLoader style={loaderStyle} />}>
                <Layout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<LuLoader style={loaderStyle} />}>
                        <Main />
                    </Suspense>
                ),
            },
            {
                path: '/profile/:login',
                element: (
                    <Suspense fallback={<LuLoader style={loaderStyle} />}>
                        <Profile />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: '/timer/:userId',
        element: (
            <Suspense fallback={<LuLoader style={loaderStyle} />}>
                <Timer />
            </Suspense>
        ),
    },
]);
