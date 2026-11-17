import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@shared/query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { CellType } from '@shared/types/cell';

export type CellBoard = { id: RecordIdString; type: CellType; icon: string; world: RecordIdString };

export type WorldBoard = { id: RecordIdString; sort: number };

type GetCellsBoardSuccess = {
    success: true;
    data: { cells: CellBoard[]; worlds: WorldBoard[] };
    message?: string;
    error?: never;
};

type GetCellsBoardError = { success: false; data: never; message: string; error: string };

type GetCellsBoardResult = GetCellsBoardSuccess | GetCellsBoardError;

const getCellsBoardRequest = async () => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/cells-board`, { method: 'GET' });

    return (await res.json()) as GetCellsBoardResult;
};

export const cellsBoardQueryOptions = () =>
    queryOptions({
        queryKey: queryKeys.cellsBoard,
        queryFn: async () => {
            const res = await getCellsBoardRequest();

            if (!res.success) {
                throw new Error(res.message);
            }

            res.data.cells = res.data.cells.map(cell => ({
                ...cell,
                icon: new URL(cell.icon, import.meta.env.VITE_PB_URL).href,
            }));

            return res.data;
        },
    });
