import {CellRecord} from "@shared/types/cell";

export const useCellsBoard = (cells: CellRecord[], lineSize = 7) => {
    const lineElements = Math.min(cells.length, lineSize);
    const result = [];
    let line = 0;
    let currentLine = [];
    let elementIndex = 1;

    for (const cell of cells.values()) {
        currentLine[elementIndex] = cell;

        if (elementIndex % lineElements === 0) {
            if (line % 2 === 1) currentLine.reverse();

            result.push(currentLine);
            currentLine = [];
            line++;
        }

        elementIndex++;
    }

    return result.reverse();
}
