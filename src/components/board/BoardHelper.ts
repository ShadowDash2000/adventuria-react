import type { CellRecord } from '@shared/types/cell';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { UserRecord } from '@shared/types/user';

export type CellPosition = { row: number; col: number };
export type CellBoard = { players?: UserRecord[] } & CellRecord;

export class BoardHelper {
    static getUserCellIndex(cellsPassed: number, cellsCount: number) {
        return this.mod(cellsPassed, cellsCount);
    }

    private static mod(a: number, m: number) {
        return ((a % m) + m) % m;
    }

    static buildCells(
        cells: CellRecord[],
        users: Map<RecordIdString, UserRecord>,
        lineSize = 7,
    ): { lines: CellBoard[][]; usersByCellIndex: Map<number, UserRecord[]> } {
        if (cells.length === 0) return { lines: [], usersByCellIndex: new Map() };

        const usersByCellIndex = new Map<number, UserRecord[]>();
        for (const [, user] of users) {
            const cellIndex = BoardHelper.getUserCellIndex(user.cellsPassed, cells.length);
            const prevUsers = usersByCellIndex.get(cellIndex) || [];
            usersByCellIndex.set(cellIndex, [...prevUsers, user]);
        }

        const lines: CellBoard[][] = [];
        let currentLine: CellBoard[] = [];
        let cellIndex = 0;

        for (let i = 0; i < cells.length; i++) {
            currentLine.push({ ...cells[i], players: usersByCellIndex.get(cellIndex) });

            const isLineFull = currentLine.length === Math.min(lineSize, cells.length);
            const isLast = i === cells.length - 1;

            if (isLineFull || isLast) {
                if (lines.length % 2 === 1) currentLine.reverse();
                lines.push(currentLine);
                currentLine = [];
            }

            cellIndex++;
        }

        return { lines, usersByCellIndex };
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

            let nextStep = current;
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
