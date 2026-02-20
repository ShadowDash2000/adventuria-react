import { Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';

const Main = () => {
    return (
        <>
            <Board />
            <CellInfoModal />
            <Spacer h={10} />
            <ActionsList />
        </>
    );
};

export default Main;
