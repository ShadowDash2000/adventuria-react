import type { CellRecord } from '@shared/types/cell';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

export type CellPosition = { row: number; col: number };
export type CellBoard = { players?: PlayerRecord[] } & CellRecord;

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
    ): { lines: CellBoard[][]; playersByCellIndex: Map<number, PlayerRecord[]> } {
        if (cells.length === 0) return { lines: [], playersByCellIndex: new Map() };

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

        const lines: CellBoard[][] = [];
        let currentLine: CellBoard[] = [];
        let cellIndex = 0;

        for (let i = 0; i < cells.length; i++) {
            currentLine.push({ ...cells[i], players: playersByCellIndex.get(cellIndex) });

            const isLineFull = currentLine.length === Math.min(lineSize, cells.length);
            const isLast = i === cells.length - 1;

            if (isLineFull || isLast) {
                if (lines.length % 2 === 1) currentLine.reverse();
                lines.push(currentLine);
                currentLine = [];
            }

            cellIndex++;
        }

        return { lines, playersByCellIndex: playersByCellIndex };
    }

    static getCoords(rows: number, cols: number, cellIndex: number): CellPosition {
        const totalCells = rows * cols;
        const normalizedIndex = ((cellIndex % totalCells) + totalCells) % totalCells;
        const row = Math.floor(normalizedIndex / cols);
        const isInverted = (row + 1) % 2 === 0;
        const rawCol = normalizedIndex % cols;
        const col = isInverted ? cols - 1 - rawCol : rawCol;

        return { row, col };
    }

    static createPath(
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
            path.push(BoardHelper.getCoords(rows, cols, current));
        }

        return path;
    }
}
