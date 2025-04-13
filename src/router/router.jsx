import {createBrowserRouter} from "react-router-dom";
import {Layout} from "../components/Layout.jsx";
import {Main} from "../components/Main.jsx";
import {Profile} from "../components/Profile.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
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