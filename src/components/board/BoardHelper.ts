import type { CellRecord } from '@shared/types/cell';
import type { WorldRecord } from '@shared/types/world';

export type CellPosition = { worldId: string; row: number; col: number };

export type CellBoard = {
    record: CellRecord;
    localIndex: number;
    indexInLine: number;
    isLastInLine: boolean;
    isLastInWorld: boolean;
};

export type LineBoard = { cells: CellBoard[]; reversed: boolean; startIndex: number };

export type WorldBoard = {
    id: string;
    rowOffset: number;
    cellIndexes: number[];
    lines: LineBoard[];
    rows: number;
    cols: number;
    cellsCount: number;
};

export type BoardModel = { worldsById: Map<string, WorldBoard>; rows: number; cols: number };

export class BoardHelper {
    static getPlayerCellIndex(cellsPassed: number, cellsCount: number) {
        return this.mod(cellsPassed, cellsCount);
    }

    private static mod(a: number, m: number) {
        return ((a % m) + m) % m;
    }

    static buildBoard(cells: CellRecord[], worlds: WorldRecord[], lineSize = 7): BoardModel {
        const worldsById = this.buildWorlds(cells, worlds);
        const rows = this.buildLayouts(cells, worldsById, lineSize);

        return {
            worldsById,
            rows: rows,
            cols: Math.max(0, ...Array.from(worldsById.values(), world => world.cols)),
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

    private static buildLayouts(
        cells: CellRecord[],
        worldsById: Map<string, WorldBoard>,
        lineSize: number,
    ): number {
        let rows = 0;

        for (const world of worldsById.values()) {
            const worldLines: LineBoard[] = [];
            const cols = Math.min(lineSize, world.cellIndexes.length);
            world.rowOffset = rows;

            for (let start = 0; start < world.cellIndexes.length; start += cols) {
                const localRow = worldLines.length;
                const lineIndexes = world.cellIndexes.slice(start, start + cols);
                const lineCells: CellBoard[] = lineIndexes.map((cellIndex, indexInLine) => ({
                    record: cells[cellIndex],
                    localIndex: start + indexInLine,
                    indexInLine,
                    isLastInLine: indexInLine === lineIndexes.length - 1,
                    isLastInWorld: start + indexInLine === world.cellIndexes.length - 1,
                }));

                const reversed = localRow % 2 === 1;
                if (reversed) lineCells.reverse();
                worldLines.push({ cells: lineCells, reversed, startIndex: start });
            }

            world.lines = worldLines;
            world.rows = worldLines.length;
            world.cols = cols;
            world.cellsCount = world.cellIndexes.length;

            rows += world.rows;
        }

        return rows;
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
