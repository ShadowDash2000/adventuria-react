import {createBrowserRouter} from "react-router-dom";
import {Layout} from "../components/Layout.jsx";
import {Main} from "../components/Main.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Main/>,
            }
        ],
    }
])