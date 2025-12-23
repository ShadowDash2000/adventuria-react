import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PlayerFloatingListStoreState {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const usePlayerFloatingListStore = create<PlayerFloatingListStoreState>()(
    persist(set => ({ open: true, setOpen: open => set({ open }) }), {
        name: 'player-floatin-list',
        partialize: state => ({ open: state.open }),
    }),
);
