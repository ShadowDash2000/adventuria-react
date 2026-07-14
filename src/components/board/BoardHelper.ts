import type { CellRecord } from '@shared/types/cell';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

export type CellPosition = { worldId: string; row: number; col: number };
export type CellBoard = { players?: PlayerRecord[] } & CellRecord;

type WorldTopology = {
    id: string;
    slug: string;
    isLoop: boolean;
    transitionToWorldId?: string;
    cellIndexes: number[];
};

export type BoardTopology = {
    totalCells: number;
    defaultWorldSlug?: string;
    worldBySlug: Map<string, WorldTopology>;
    nextByCellIndex: Map<number, number>;
    prevByCellIndex: Map<number, number>;
    positionByCellIndex: Map<number, CellPosition>;
};

const EMPTY_TOPOLOGY: BoardTopology = {
    totalCells: 0,
    worldBySlug: new Map(),
    nextByCellIndex: new Map(),
    prevByCellIndex: new Map(),
    positionByCellIndex: new Map(),
};

export class BoardHelper {
    static getPlayerCellIndex(cellsPassed: number, cellsCount: number) {
        return this.mod(cellsPassed, cellsCount);
    }

    private static mod(a: number, m: number) {
        return ((a % m) + m) % m;
    }

    static buildCells(
        cells: CellRecord[],
        players: Map<RecordIdString, PlayerRecord>,
        playersProgress: Map<RecordIdString, PlayerProgressRecord>,
        lineSize = 7,
    ): {
        lines: Map<string, CellBoard[][]>;
        worldSizesById: Map<string, { rows: number; cols: number; cellsCount: number }>;
        playersByCellIndex: Map<number, PlayerRecord[]>;
        topology: BoardTopology;
    } {
        if (cells.length === 0)
            return {
                lines: new Map(),
                worldSizesById: new Map(),
                playersByCellIndex: new Map(),
                topology: EMPTY_TOPOLOGY,
            };

        const playersByCellIndex = new Map<number, PlayerRecord[]>();
        for (const [, player] of players) {
            const playerProgress = playersProgress.get(player.id);
            const cellsPassed = playerProgress?.cellsPassed || 0;
            const cellIndex = BoardHelper.getPlayerCellIndex(cellsPassed, cells.length);
            const prevPlayers = playersByCellIndex.get(cellIndex) || [];
            playersByCellIndex.set(cellIndex, [...prevPlayers, player]);
        }

        playersByCellIndex.forEach(players => {
            players.sort((a, b) => new Date(a.updated).getTime() - new Date(b.updated).getTime());
        });

        const lines = new Map<string, CellBoard[][]>();
        const worldSizesById = new Map<
            string,
            { rows: number; cols: number; cellsCount: number }
        >();
        const positionByCellIndex = new Map<number, CellPosition>();
        const worldBySlug = new Map<string, WorldTopology>();
        const worldSlugById = new Map<string, string>();

        for (let i = 0; i < cells.length; i++) {
            const world = cells[i].expand?.world;
            if (!world?.slug) continue;

            if (!worldBySlug.has(world.slug)) {
                worldBySlug.set(world.slug, {
                    id: world.id,
                    slug: world.slug,
                    isLoop: world.is_loop,
                    transitionToWorldId: world.transition_to_world,
                    cellIndexes: [],
                });
                worldSlugById.set(world.id, world.slug);
            }
            worldBySlug.get(world.slug)!.cellIndexes.push(i);
        }

        for (const [, world] of worldBySlug) {
            const worldLines: CellBoard[][] = [];
            const worldCells = world.cellIndexes;
            const lineCapacity = Math.min(lineSize, worldCells.length);

            for (let start = 0; start < worldCells.length; start += lineCapacity) {
                const row = worldLines.length;
                const lineIndexes = worldCells.slice(start, start + lineCapacity);
                const lineCells = lineIndexes.map(cellIndex => ({
                    ...cells[cellIndex],
                    players: playersByCellIndex.get(cellIndex),
                }));

                if (row % 2 === 1) lineCells.reverse();
                worldLines.push(lineCells);

                lineIndexes.forEach((cellIndex, indexInLine) => {
                    const col = row % 2 === 1 ? lineIndexes.length - 1 - indexInLine : indexInLine;
                    positionByCellIndex.set(cellIndex, { worldId: world.id, row, col });
                });
            }

            lines.set(world.slug, worldLines);
            worldSizesById.set(world.id, {
                rows: worldLines.length,
                cols: lineCapacity,
                cellsCount: worldCells.length,
            });
        }

        const nextByCellIndex = new Map<number, number>();
        const prevByCellIndex = new Map<number, number>();

        for (const [, world] of worldBySlug) {
            const indexes = world.cellIndexes;
            if (!indexes.length) continue;

            for (let i = 0; i < indexes.length - 1; i++) {
                nextByCellIndex.set(indexes[i], indexes[i + 1]);
                prevByCellIndex.set(indexes[i + 1], indexes[i]);
            }

            const first = indexes[0];
            const last = indexes[indexes.length - 1];

            if (world.isLoop) {
                nextByCellIndex.set(last, first);
                prevByCellIndex.set(first, last);
            } else {
                const transitionWorldSlug = world.transitionToWorldId
                    ? worldSlugById.get(world.transitionToWorldId)
                    : undefined;
                const transitionWorld = transitionWorldSlug
                    ? worldBySlug.get(transitionWorldSlug)
                    : undefined;
                const transitionFirst = transitionWorld?.cellIndexes[0];

                if (transitionFirst !== undefined) {
                    nextByCellIndex.set(last, transitionFirst);
                    prevByCellIndex.set(transitionFirst, last);
                } else {
                    nextByCellIndex.set(last, last);
                }

                if (!prevByCellIndex.has(first)) {
                    prevByCellIndex.set(first, first);
                }
            }
        }

        const topology: BoardTopology = {
            totalCells: cells.length,
            defaultWorldSlug: cells[0]?.expand?.world?.slug,
            worldBySlug,
            nextByCellIndex,
            prevByCellIndex,
            positionByCellIndex,
        };

        return { lines, worldSizesById, playersByCellIndex: playersByCellIndex, topology };
    }

    static getPositionByCellsPassed(
        topology: BoardTopology,
        worldId: string,
        cellsPassed: number,
    ): CellPosition | null {
        const cellIndex = this.getCellIndexByCellsPassed(topology, worldId, cellsPassed);
        if (cellIndex === null) return null;

        return topology.positionByCellIndex.get(cellIndex) || null;
    }

    private static getWorldById(topology: BoardTopology, worldId: string): WorldTopology | null {
        for (const world of topology.worldBySlug.values()) {
            if (world.id === worldId) return world;
        }

        return null;
    }

    private static getCellIndexByCellsPassed(
        topology: BoardTopology,
        worldId: string,
        cellsPassed: number,
    ): number | null {
        const world = this.getWorldById(topology, worldId);
        if (!world || world.cellIndexes.length === 0) return null;

        const normalized = this.mod(cellsPassed, world.cellIndexes.length);

        return world.cellIndexes[normalized] ?? null;
    }

    static getCoords(worldId: string, rows: number, cols: number, cellIndex: number): CellPosition {
        const totalCells = rows * cols;
        const normalizedIndex = ((cellIndex % totalCells) + totalCells) % totalCells;
        const row = Math.floor(normalizedIndex / cols);
        const isInverted = (row + 1) % 2 === 0;
        const rawCol = normalizedIndex % cols;
        const col = isInverted ? cols - 1 - rawCol : rawCol;

        return { worldId: worldId, row, col };
    }

    static createPath(
        worldId: string,
        rows: number,
        cols: number,
        startCellsPassed: number,
        dstCellsPassed: number,
    ): CellPosition[] {
        const path: CellPosition[] = [];

        if (startCellsPassed === dstCellsPassed) return path;

        const direction = dstCellsPassed > startCellsPassed ? 1 : -1;

        let current = startCellsPassed;
        while (current !== dstCellsPassed) {
            const currentRowStart = Math.floor(current / cols) * cols;
            const currentRowEnd = currentRowStart + cols - 1;

            let nextStep: number;
            if (direction === 1) {
                if (current === currentRowEnd) {
                    nextStep = current + 1;
                } else {
                    nextStep = dstCellsPassed > currentRowEnd ? currentRowEnd : dstCellsPassed;
                }
            } else {
                if (current === currentRowStart) {
                    nextStep = current - 1;
                } else {
                    nextStep = dstCellsPassed < currentRowStart ? currentRowStart : dstCellsPassed;
                }
            }

            current = nextStep;
            path.push(BoardHelper.getCoords(worldId, rows, cols, current));
        }

        return path;
    }
}
