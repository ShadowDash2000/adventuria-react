import { Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';
import { ActionsFilter } from '@components/actions-list/ActionsFilter';
import { ActionsListProvider } from '@components/actions-list/ActionsListContext';
import { CellInfoModal } from '@components/board/cells/cell-info/CellInfoModal';
import { EventSummary } from '@components/event-stats/EventSummary';

const Main = () => {
    return (
        <>
            <EventSummary />
            <Board />
            <CellInfoModal />
            <Spacer h={10} />
            <ActionsListProvider maxW="1642px">
                <ActionsFilter />
                <ActionsList />
            </ActionsListProvider>
        </>
    );
};

export default Main;
