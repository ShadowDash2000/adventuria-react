import {UserActions} from "../UserActions";
import {useParams} from "react-router-dom";
import {CollectionListInfiniteProvider} from "@context/CollectionListInfiniteContext";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Sort} from "@shared/hook/useSort";

export const Profile = () => {
    const {pb} = useAppContext();
    const login = useParams()?.login;

    return (
        <>
            <CollectionListInfiniteProvider
                collection={pb.collection('actions')}
                pageSize={24}
                initialSort={new Map([['created', Sort.DESC]])}
                options={{
                    filter: `user.name = "${login}"`,
                }}
            >
                <UserActions/>
            </CollectionListInfiniteProvider>
        </>
    )
}