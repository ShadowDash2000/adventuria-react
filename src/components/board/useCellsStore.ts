import { create } from 'zustand/react';
import type { RecordIdString } from '@shared/types/pocketbase';

type CellsStoreState = {
    selectedCellId: RecordIdString | null;
    isModalOpen: boolean;
    openCellInfo: (id: RecordIdString) => void;
    closeCellInfo: () => void;
};

export const useCellsStore = create<CellsStoreState>(set => ({
    selectedCellId: null,
    isModalOpen: false,
    openCellInfo: id => set({ selectedCellId: id, isModalOpen: true }),
    closeCellInfo: () => set({ isModalOpen: false, selectedCellId: null }),
}));
