import type { RecordIdString } from '@shared/types/pocketbase';
import { create } from 'zustand/react';

type ItemsStoreState = {
    selectedItemId: RecordIdString | null;
    isDialogOpen: boolean;
    openItemDetails: (id: RecordIdString) => void;
    closeItemDetails: () => void;
};

export const useItemsStore = create<ItemsStoreState>(set => ({
    selectedItemId: null,
    isDialogOpen: false,
    openItemDetails: id => set({ selectedItemId: id, isDialogOpen: true }),
    closeItemDetails: () => set({ selectedItemId: null, isDialogOpen: false }),
}));
