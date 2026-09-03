import { Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { ActionsList } from '@components/actions-list/ActionsList';
import { ActionsFilter } from '@components/actions-list/ActionsFilter';
import { ActionsListProvider } from '@components/actions-list/ActionsListContext';
import { EventSummary } from '@components/event-stats/EventSummary';
import { CellContextMenu } from '@components/debug/cell-context-menu/Menu';
import { useAppContext } from '@context/AppContext';

const Main = () => {
    const { isAuth } = useAppContext();

    return (
        <>
            <EventSummary />
            <Board />
            {isAuth && <CellContextMenu />}
            <Spacer h={10} />
            <ActionsListProvider maxW="1642px">
                <ActionsFilter />
                <ActionsList />
            </ActionsListProvider>
        </>
    );
};

export default Main;
