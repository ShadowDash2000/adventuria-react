import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Main } from '../components/pages/Main';
import { Profile } from '../components/pages/Profile';
import { Timer } from '../components/pages/Timer';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Main /> },
            { path: '/profile/:login', element: <Profile /> },
        ],
    },
    { path: '/timer/:userId', element: <Timer /> },
]);
