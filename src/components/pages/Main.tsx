import { Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';
import { EventSummary } from '@components/event-stats/EventSummary';

const Main = () => {
    return (
        <>
            <EventSummary />
            <Board />
            <CellInfoModal />
            <Spacer h={10} />
            <ActionsList maxW="1642px" />
        </>
    );
};

export default Main;
