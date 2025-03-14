import {createBrowserRouter} from "react-router-dom";
import {Layout} from "../components/Layout.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: null,
            }
        ],
    }
])