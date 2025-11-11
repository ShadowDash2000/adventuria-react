import {Board} from "../board/Board";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {UserMenu} from "../board/UserMenu";
import {Box} from "@chakra-ui/react";

export const Main = () => {
    const {isAuth} = useAppContext();

    return (
        <>
            <Box position="relative">
                <Board/>
            </Box>
            {isAuth ? <UserMenu/> : null}
        </>
    )
}