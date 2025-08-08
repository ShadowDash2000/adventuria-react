import {UserActionsList} from "../profile/UserActionsList";
import {useParams} from "react-router-dom";
import {CollectionListInfiniteProvider} from "@context/CollectionListInfiniteContext";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Sort} from "@shared/hook/useSort";
import {CollectionOneFilterProvider} from "@context/CollectionOneFilterContext";

export const Profile = () => {
    const {pb} = useAppContext();
    const login = useParams().login;

    return (
        <>
            <CollectionOneFilterProvider
                collection={pb.collection('users')}
                filter={`name = "${login}"`}
            >
                <CollectionListInfiniteProvider
                    collection={pb.collection('actions')}
                    pageSize={24}
                    initialSort={new Map([['created', Sort.DESC]])}
                    options={{
                        filter: `user.name = "${login}"`,
                    }}
                >
                    <UserActionsList/>
                </CollectionListInfiniteProvider>
            </CollectionOneFilterProvider>
        </>
    )
}