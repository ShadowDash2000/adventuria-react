import type { RecordIdString } from '@shared/types/pocketbase';
import { create } from 'zustand/react';

type CellContextMenuStoreState = {
    selectedCellId: RecordIdString | null;
    isOpen: boolean;
    anchorElement: HTMLDivElement | null;
    openMenu: (id: RecordIdString, anchorElement: HTMLDivElement) => void;
    closeMenu: () => void;
};

export const useCellContextMenuStore = create<CellContextMenuStoreState>(set => ({
    selectedCellId: null,
    isOpen: false,
    anchorElement: null,
    openMenu: (id, anchorElement) =>
        set({ selectedCellId: id, isOpen: true, anchorElement: anchorElement }),
    closeMenu: () => set({ isOpen: false, selectedCellId: null, anchorElement: null }),
}));
