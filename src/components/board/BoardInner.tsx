import { Actors } from '@components/board/actors/Actors';
import { useAppContext } from '@context/AppContext';
import { Cells } from './cells/Cells';
import { BoardHelper } from './BoardHelper';
import { CellsActors } from './cells/CellsActors';
import { PlayerActionMenu } from '@components/PlayerActionMenu';
import { BoardInnerContext, useBoardContext, useBoardDataContext } from '.';
import { useBoardDimensions } from './useBoardDimensions';
import { useActorsMovementSubscription } from './useActorsMovementSubscription';
import { useCellsSubscription } from '@components/board/useCellsSubscription';

export const BoardInner = () => {
    const { pb, isAuth, playerId } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const { activeActors, cells, worlds } = useBoardDataContext();

    const board = BoardHelper.buildBoard(cells, worlds);

    const boardDimensions = useBoardDimensions(boardInnerRef);

    const rows = board.rows;
    const cols = board.cols;
    const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;

    useCellsSubscription({ pb, isAuth });
    useActorsMovementSubscription({ pb, isAuth, playerId, worldsById: board.worldsById });

    return (
        <BoardInnerContext.Provider
            value={{ activeActors, worldsById: board.worldsById, cellWidth, cellHeight }}
        >
            <Cells />
            {cellWidth !== 0 && cellHeight !== 0 && <Actors />}
            <CellsActors
                activeActors={activeActors}
                cellWidth={cellWidth}
                cellHeight={cellHeight}
            />
            {isAuth ? <PlayerActionMenu /> : null}
        </BoardInnerContext.Provider>
    );
};
