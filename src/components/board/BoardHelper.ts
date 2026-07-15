import type { CellRecord } from '@shared/types/cell';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { WorldRecord } from '@shared/types/world';

export type CellPosition = { worldId: string; row: number; col: number };
export type CellBoard = { players?: PlayerRecord[] } & CellRecord;

export type WorldBoard = {
    id: string;
    rowOffset: number;
    cellIndexes: number[];
    lines: CellBoard[][];
    rows: number;
    cols: number;
    cellsCount: number;
};

export type BoardModel = {
    worldsById: Map<string, WorldBoard>;
    lines: CellBoard[][];
    rows: number;
    cols: number;
    playersByCellIndex: Map<number, PlayerRecord[]>;
    positionByCellIndex: Map<number, CellPosition>;
};

export class BoardHelper {
    static getPlayerCellIndex(cellsPassed: number, cellsCount: number) {
        return this.mod(cellsPassed, cellsCount);
    }

    private static mod(a: number, m: number) {
        return ((a % m) + m) % m;
    }

    static buildBoard(
        cells: CellRecord[],
        worlds: WorldRecord[],
        players: Map<RecordIdString, PlayerRecord>,
        playersProgress: Map<RecordIdString, PlayerProgressRecord>,
        lineSize = 7,
    ): BoardModel {
        const worldsById = this.buildWorlds(cells, worlds);
        const playersByCellIndex = this.placePlayers(players, playersProgress, worldsById);
        const { lines, positionByCellIndex } = this.buildLayouts(
            cells,
            worldsById,
            playersByCellIndex,
            lineSize,
        );

        return {
            worldsById,
            lines,
            rows: lines.length,
            cols: Math.max(0, ...Array.from(worldsById.values(), world => world.cols)),
            playersByCellIndex,
            positionByCellIndex,
        };
    }

    private static buildWorlds(
        cells: CellRecord[],
        worlds: WorldRecord[],
    ): Map<string, WorldBoard> {
        const worldsById = new Map<string, WorldBoard>();

        worlds
            .slice()
            .sort((a, b) => a.sort - b.sort)
            .forEach(world => {
                worldsById.set(world.id, {
                    id: world.id,
                    rowOffset: 0,
                    cellIndexes: [],
                    lines: [],
                    rows: 0,
                    cols: 0,
                    cellsCount: 0,
                });
            });

        cells.forEach((cell, cellIndex) => {
            worldsById.get(cell.world)?.cellIndexes.push(cellIndex);
        });

        return worldsById;
    }

    private static placePlayers(
        players: Map<RecordIdString, PlayerRecord>,
        playersProgress: Map<RecordIdString, PlayerProgressRecord>,
        worldsById: Map<string, WorldBoard>,
    ): Map<number, PlayerRecord[]> {
        const playersByCellIndex = new Map<number, PlayerRecord[]>();

        for (const [, player] of players) {
            const progress = playersProgress.get(player.id);
            if (!progress) continue;

            const world = worldsById.get(progress.current_world);
            if (!world?.cellIndexes.length) continue;

            const localIndex = this.getPlayerCellIndex(
                progress.cells_passed,
                world.cellIndexes.length,
            );
            const cellIndex = world.cellIndexes[localIndex];
            const cellPlayers = playersByCellIndex.get(cellIndex) || [];
            playersByCellIndex.set(cellIndex, [...cellPlayers, player]);
        }

        playersByCellIndex.forEach(cellPlayers => {
            cellPlayers.sort((a, b) => {
                const aUpdated = playersProgress.get(a.id)?.updated;
                const bUpdated = playersProgress.get(b.id)?.updated;
                return new Date(aUpdated || 0).getTime() - new Date(bUpdated || 0).getTime();
            });
        });

        return playersByCellIndex;
    }

    private static buildLayouts(
        cells: CellRecord[],
        worldsById: Map<string, WorldBoard>,
        playersByCellIndex: Map<number, PlayerRecord[]>,
        lineSize: number,
    ): { lines: CellBoard[][]; positionByCellIndex: Map<number, CellPosition> } {
        const lines: CellBoard[][] = [];
        const positionByCellIndex = new Map<number, CellPosition>();

        for (const world of worldsById.values()) {
            const worldLines: CellBoard[][] = [];
            const cols = Math.min(lineSize, world.cellIndexes.length);
            world.rowOffset = lines.length;

            for (let start = 0; start < world.cellIndexes.length; start += cols) {
                const localRow = worldLines.length;
                const row = world.rowOffset + localRow;
                const lineIndexes = world.cellIndexes.slice(start, start + cols);
                const lineCells = lineIndexes.map(cellIndex => ({
                    ...cells[cellIndex],
                    players: playersByCellIndex.get(cellIndex),
                }));

                if (localRow % 2 === 1) lineCells.reverse();
                worldLines.push(lineCells);

                lineIndexes.forEach((cellIndex, indexInLine) => {
                    const col =
                        localRow % 2 === 1 ? lineIndexes.length - 1 - indexInLine : indexInLine;
                    positionByCellIndex.set(cellIndex, { worldId: world.id, row, col });
                });
            }

            world.lines = worldLines;
            world.rows = worldLines.length;
            world.cols = cols;
            world.cellsCount = world.cellIndexes.length;
            lines.push(...worldLines);
        }

        return { lines, positionByCellIndex };
    }

    static getCoords(world: WorldBoard, cellIndex: number): CellPosition {
        const normalizedIndex = this.mod(cellIndex, world.cellsCount);
        const localRow = Math.floor(normalizedIndex / world.cols);
        const rowStart = localRow * world.cols;
        const rowLength = Math.min(world.cols, world.cellsCount - rowStart);
        const rawCol = normalizedIndex - rowStart;
        const col = localRow % 2 === 1 ? rowLength - 1 - rawCol : rawCol;

        return { worldId: world.id, row: world.rowOffset + localRow, col };
    }

    static createPath(
        world: WorldBoard,
        startCellsPassed: number,
        dstCellsPassed: number,
    ): CellPosition[] {
        const path: CellPosition[] = [];
        if (startCellsPassed === dstCellsPassed) return path;

        const direction = dstCellsPassed > startCellsPassed ? 1 : -1;
        let current = startCellsPassed;

        while (current !== dstCellsPassed) {
            const currentRowStart = Math.floor(current / world.cols) * world.cols;
            const currentRowEnd = currentRowStart + world.cols - 1;

            let nextStep: number;
            if (direction === 1) {
                nextStep =
                    current === currentRowEnd
                        ? current + 1
                        : Math.min(dstCellsPassed, currentRowEnd);
            } else {
                nextStep =
                    current === currentRowStart
                        ? current - 1
                        : Math.max(dstCellsPassed, currentRowStart);
            }

            current = nextStep;
            path.push(this.getCoords(world, current));
        }

        return path;
    }
}
