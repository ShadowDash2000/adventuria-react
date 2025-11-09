import {Board} from "../board/Board";
import {CollectionListAllProvider} from "@context/CollectionListAllContext";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {UserMenu} from "../board/UserMenu";
import {Box} from "@chakra-ui/react";

export const Main = () => {
    const {pb, isAuth} = useAppContext();

    return (
        <>
            <Box position="relative">
                <CollectionListAllProvider collection={pb.collection('cells')}>
                    <Board/>
                </CollectionListAllProvider>
            </Box>
            {isAuth ? <UserMenu/> : null}
        </>
    )
}