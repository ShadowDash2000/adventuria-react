import { Players } from './players/Players';
import { useAppContext } from '@context/AppContext';
import { Cells } from './cells/Cells';
import { BoardHelper } from './BoardHelper';
import { CellsPlayers } from './cells/CellsPlayers';
import { PlayerActionMenu } from '@components/PlayerActionMenu';
import { BoardInnerContext, useBoardContext, useBoardDataContext } from '.';
import { useBoardDimensions } from './useBoardDimensions';
import { usePlayersProgressSubscription } from './usePlayersProgressSubscription';

export const BoardInner = () => {
    const { pb, isAuth, player } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const {
        players: playersRaw,
        playersProgress: playersProgressRaw,
        cells,
        worlds,
    } = useBoardDataContext();
    const players = new Map(playersRaw.map(p => [p.id, p]));
    const { playersProgress, worldsByIdRef } = usePlayersProgressSubscription({
        pb,
        isAuth,
        playerId: player?.id,
        initialProgress: playersProgressRaw,
    });
    const board = BoardHelper.buildBoard(cells, worlds, players, playersProgress);
    worldsByIdRef.current = board.worldsById;

    const cellsOrderedRev = board.lines.slice().reverse();
    const boardDimensions = useBoardDimensions(boardInnerRef);

    const rows = board.rows;
    const cols = board.cols;
    const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;

    return (
        <BoardInnerContext.Provider
            value={{
                cellsOrdered: board.lines,
                playersByCellIndex: board.playersByCellIndex,
                cellsOrderedRev,
                positionByCellIndex: board.positionByCellIndex,
                worldsById: board.worldsById,
                players: players,
                playersProgress,
                cellWidth,
                cellHeight,
            }}
        >
            <Cells />
            {cellWidth !== 0 && cellHeight !== 0 && <Players />}
            <CellsPlayers />
            {isAuth ? <PlayerActionMenu /> : null}
        </BoardInnerContext.Provider>
    );
};
