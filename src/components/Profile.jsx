import {UserActions} from "./UserActions.jsx";
import {Suspense} from "react";
import {useParams} from "react-router-dom";
import {LuLoader} from "react-icons/lu";

export const Profile = () => {
    const login = useParams()?.login;

    return (
        <>
            <Suspense fallback={<LuLoader/>}>
                <UserActions login={login}/>
            </Suspense>
        </>
    )
}