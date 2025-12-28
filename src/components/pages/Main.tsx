import { Box, Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';

const Main = () => {
    return (
        <>
            <Box maxW="vw">
                <Board />
                <CellInfoModal />
                <Spacer h={10} />
                <ActionsList />
            </Box>
        </>
    );
};

export default Main;
