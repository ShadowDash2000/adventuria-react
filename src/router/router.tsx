import {createBrowserRouter} from "react-router-dom";
import {Layout} from "../components/Layout";
import {Main} from "../components/pages/Main";
import {Profile} from "../components/pages/Profile";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        children: [
            {
                path: "/",
                element: <Main/>,
            },
            {
                path: "/profile/:login",
                element: <Profile/>,
            }
        ],
    }
])