import {create} from "zustand";

const collectionName = 'cells';

export const useCellsStore = create((set, get) => ({
    pb: null,
    cells: new Map(),

    setPocketBase: (pb) => set({pb: pb}),
    fetch: async () => {
        const cells = await get().pb.collection(collectionName).getFullList({
            sort: 'sort',
        });

        const cellsMap = new Map();
        cells.forEach((cell) => cellsMap.set(cell.id, cell));

        set({cells: cellsMap});
    },
    update: (cell) => {
        const cellsMap = new Map(get().cells);
        cellsMap.set(cell.id, cell);
        set({cells: cellsMap});
    },
    getById: (id) => get().cells.get(id),
    getBoardFormatted: () => {
        const lineElements = 7;
        const result = [];
        let line = 0;
        let currentLine = [];
        let elementIndex = 1;

        for (const cell of get().cells.values()) {
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
    },
}))