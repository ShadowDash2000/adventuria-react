import { useAppContext } from '@context/AppContextProvider';
import { Box, Spacer } from '@chakra-ui/react';
import { LatestActions } from '../LatestActions';
import { CollectionListInfiniteProvider } from '@context/CollectionListInfiniteContext';
import { Sort } from '@shared/hook/useSort';
import { Board } from '../board/Board';

export const Main = () => {
    const { pb } = useAppContext();

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
        </>
    );
};
