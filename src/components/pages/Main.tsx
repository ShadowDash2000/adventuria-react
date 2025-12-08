import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { UserActionMenu } from '../board/UserActionMenu';
import { Box, Spacer } from '@chakra-ui/react';
import { LatestActions } from '../LatestActions';
import { CollectionListInfiniteProvider } from '@context/CollectionListInfiniteContext';
import { Sort } from '@shared/hook/useSort';
import { Board } from '../board/Board';

export const Main = () => {
    const { pb, isAuth } = useAppContext();

    return (
        <>
            <Box position="relative">
                <Board />
                <Spacer h={10} />
                <CollectionListInfiniteProvider
                    collection={pb.collection('actions')}
                    expand="game,cell,user"
                    pageSize={10}
                    initialSort={new Map([['created', Sort.DESC]])}
                    refetchOnWindowFocus={false}
                >
                    <LatestActions />
                </CollectionListInfiniteProvider>
            </Box>
            {isAuth ? <UserActionMenu /> : null}
        </>
    );
};
