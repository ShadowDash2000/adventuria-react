import { useEffect, useState } from 'react';
import { Players } from './players/Players';
import { useAppContext } from '@context/AppContext';
import { Cells } from './cells/Cells';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { RecordIdString } from '@shared/types/pocketbase';
import { BoardHelper } from './BoardHelper';
import { CellsPlayers } from './cells/CellsPlayers';
import { PlayerActionMenu } from '@components/PlayerActionMenu';
import { usePlayersStore } from '@components/board/players/usePlayersStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { BoardInnerContext, useBoardContext, useBoardDataContext } from '.';
import { pbCollections } from '@shared/pbSchema';

type Dimension = { width: number; height: number };

export const BoardInner = () => {
    const { pb, isAuth, player } = useAppContext();
    const { boardInnerRef } = useBoardContext();
    const {
        players: playersRaw,
        playersProgress: playersProgressRaw,
        cells,
    } = useBoardDataContext();
    const players = new Map(playersRaw.map(p => [p.id, p]));
    const [playersProgress, setPlayersProgress] = useState<
        Map<RecordIdString, PlayerProgressRecord>
    >(new Map(playersProgressRaw.map(p => [p.player, p])));

    const cellsOrdered = BoardHelper.buildCells(cells, players, playersProgress);
    const defaultWorldSlug = cellsOrdered.topology.defaultWorldSlug;
    const defaultWorldId = defaultWorldSlug
        ? cellsOrdered.topology.worldBySlug.get(defaultWorldSlug)?.id
        : undefined;
    const defaultWorldSize = defaultWorldId
        ? cellsOrdered.worldSizesById.get(defaultWorldId)
        : undefined;
    const currentWorldCellsOrdered = defaultWorldSlug
        ? cellsOrdered.lines.get(defaultWorldSlug) || []
        : [];
    const cellsOrderedRev = currentWorldCellsOrdered.slice().reverse();

    // board geometry
    const [boardDimensions, setBoardDimensions] = useState<Dimension>({ width: 0, height: 0 });

    // derived cell size in px based on container size
    const rows = defaultWorldSize?.rows || 0;
    const cols = defaultWorldSize?.cols || 0;
    const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;

    // observe board container size and update boardWidth/boardHeight
    useEffect(() => {
        const board = boardInnerRef.current;
        if (!board) return;

        const measure = () => {
            const rect = board.getBoundingClientRect();
            setBoardDimensions({ width: rect.width, height: rect.height });
        };

        // initial measure
        measure();

        const ro = new ResizeObserver(() => {
            measure();
        });
        ro.observe(board);

        return () => {
            ro.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!isAuth) return;

        pb.collection(pbCollections.playersProgress).subscribe<PlayerProgressRecord>('*', e => {
            switch (e.action) {
                case 'update':
                    setPlayersProgress(prev => {
                        if (!prev.has(e.record.player)) return prev;

                        if (
                            !(
                                e.record.player === player.id &&
                                useRollDiceStore.getState().isRolling
                            )
                        ) {
                            const playerWorldId = prev.get(e.record.player)!.current_world;
                            const worldSize = cellsOrdered.worldSizesById.get(playerWorldId);
                            if (!worldSize) return prev;

                            usePlayersStore
                                .getState()
                                .addPaths(
                                    e.record.player,
                                    BoardHelper.createPath(
                                        playerWorldId,
                                        worldSize.rows,
                                        worldSize.cols,
                                        prev.get(e.record.player)!.cells_passed,
                                        e.record.cells_passed,
                                    ),
                                );
                        }

                        const next = new Map(prev);
                        next.set(e.record.player, e.record);
                        return next;
                    });
                    break;
            }
        });

        return () => {
            pb.collection(pbCollections.players).unsubscribe();
        };
    }, [pb, isAuth, cellsOrdered.worldSizesById]);

    return (
        <BoardInnerContext.Provider
            value={{
                cellsOrdered: currentWorldCellsOrdered,
                playersByCellIndex: cellsOrdered.playersByCellIndex,
                cellsOrderedRev,
                topology: cellsOrdered.topology,
                defaultWorldId,
                defaultWorldSlug,
                worldSizesById: cellsOrdered.worldSizesById,
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
