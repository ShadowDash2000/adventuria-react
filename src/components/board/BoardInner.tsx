import { Players } from './players/Players';
import { useAppContext } from '@context/AppContext';
import { Cells } from './cells/Cells';
import { BoardHelper } from './BoardHelper';
import { CellsPlayers } from './cells/CellsPlayers';
import { PlayerActionMenu } from '@components/PlayerActionMenu';
import { BoardInnerContext, useBoardContext, useBoardDataContext } from '.';
import { useBoardDimensions } from './useBoardDimensions';
import { usePlayersMovementSubscription } from './usePlayersMovementSubscription';
import { useCellsSubscription } from '@components/board/useCellsSubscription';

export const BoardInner = () => {
    const { pb, isAuth, playerId } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const { activePlayers, cells, worlds } = useBoardDataContext();

    const board = BoardHelper.buildBoard(cells, worlds);

    const boardDimensions = useBoardDimensions(boardInnerRef);

    const rows = board.rows;
    const cols = board.cols;
    const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;

    useCellsSubscription({ pb, isAuth });
    usePlayersMovementSubscription({ pb, isAuth, playerId, worldsById: board.worldsById });

    return (
        <BoardInnerContext.Provider
            value={{ activePlayers, worldsById: board.worldsById, cellWidth, cellHeight }}
        >
            <Cells />
            {cellWidth !== 0 && cellHeight !== 0 && <Players />}
            <CellsPlayers
                activePlayers={activePlayers}
                cellWidth={cellWidth}
                cellHeight={cellHeight}
            />
            {isAuth ? <PlayerActionMenu /> : null}
        </BoardInnerContext.Provider>
    );
};
