import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ActorsFloatingListStoreState {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const useActorsFloatingListStore = create<ActorsFloatingListStoreState>()(
    persist(set => ({ open: true, setOpen: open => set({ open }) }), {
        name: 'actors-floating-list',
        partialize: state => ({ open: state.open }),
    }),
);
