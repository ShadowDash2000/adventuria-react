import { Box, Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';

const Main = () => {
    return (
        <>
            <Box maxW="vw">
                <Board />
                <Spacer h={10} />
                <ActionsList />
            </Box>
        </>
    );
};

export default Main;
