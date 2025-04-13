import {useUsersStore} from "../pocketbase/users.js";
import {useParams} from "react-router-dom";

export const Profile = () => {
    const login = useParams()?.login;
    const user = useUsersStore(state => state.getByLogin(login));

    return (
        <>

        </>
    )
}