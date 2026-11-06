import { Spacer } from '@chakra-ui/react';
import { Board } from '../board/Board';
import { DiceScene } from '@components/dices';
import { ActionsList } from '@components/actions-list/ActionsList';
import { ActionsFilter } from '@components/actions-list/ActionsFilter';
import { ActionsListProvider } from '@components/actions-list/ActionsListContext';
import { EventSummary } from '@components/event-stats/EventSummary';
import { CellContextMenu } from '@components/debug/cell-context-menu/Menu';
import { WheelDialog } from '@components/wheels';

const Main = () => {
    return (
        <>
            <EventSummary />
            <Board />
            <DiceScene />
            <WheelDialog />
            <CellContextMenu />
            <Spacer h={10} />
            <ActionsListProvider maxW="1642px">
                <ActionsFilter />
                <ActionsList />
            </ActionsListProvider>
        </>
    );
};

export default Main;
