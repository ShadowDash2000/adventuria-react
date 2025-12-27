import { useAppContext } from '@context/AppContext';
import { Box, Spacer } from '@chakra-ui/react';
import { ActionsList } from '../ActionsList';
import { CollectionListInfiniteProvider } from '@context/CollectionListInfiniteContext';
import { Sort } from '@shared/hook/useSort';
import { Board } from '../board/Board';

const Main = () => {
    const { pb } = useAppContext();

    return (
        <>
            <Box maxW="vw">
                <Board />
                <Spacer h={10} />
                <CollectionListInfiniteProvider
                    collection={pb.collection('actions')}
                    expand="activity,cell,cell.filter.activities,user"
                    pageSize={10}
                    initialSort={new Map([['created', Sort.DESC]])}
                    refetchOnWindowFocus={false}
                >
                    <ActionsList />
                </CollectionListInfiniteProvider>
            </Box>
        </>
    );
};

export default Main;
