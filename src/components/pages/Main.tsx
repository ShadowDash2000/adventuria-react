import {Board} from "../board/Board";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {UserMenu} from "../board/UserMenu";
import {Box, Spacer} from "@chakra-ui/react";
import {LatestActions} from "../LatestActions";
import {CollectionListInfiniteProvider} from "@context/CollectionListInfiniteContext";
import {Sort} from "@shared/hook/useSort";
import {BoardDataProvider} from "../board/BoardDataContext";

export const Main = () => {
    const {pb, isAuth} = useAppContext();

    return (
        <>
            <Box position="relative">
                <BoardDataProvider>
                    <Board/>
                </BoardDataProvider>
                <Spacer h={10}/>
                <CollectionListInfiniteProvider
                    collection={pb.collection('actions')}
                    expand='game,cell,user'
                    pageSize={10}
                    initialSort={new Map([['created', Sort.DESC]])}
                >
                    <LatestActions/>
                </CollectionListInfiniteProvider>
            </Box>
            {isAuth ? <UserMenu/> : null}
        </>
    )
}