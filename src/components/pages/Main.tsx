import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { UserMenu } from '../board/UserMenu';
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
                    fields={
                        'id,type,diceRoll,comment,created,' +
                        'expand.user.id,expand.user.collectionName,expand.user.name,' +
                        'expand.user.avatar,expand.user.color,' +
                        'expand.cell.name,' +
                        'expand.game.name,expand.game.cover'
                    }
                    pageSize={10}
                    initialSort={new Map([['created', Sort.DESC]])}
                    refetchOnWindowFocus={false}
                >
                    <LatestActions />
                </CollectionListInfiniteProvider>
            </Box>
            {isAuth ? <UserMenu /> : null}
        </>
    );
};
