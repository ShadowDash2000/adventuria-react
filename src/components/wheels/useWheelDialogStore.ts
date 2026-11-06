import { create } from 'zustand/react';

export type WheelType = 'activities' | 'items' | 'items-on-cell';

interface WheelDialogStoreState {
    activeWheel: WheelType | null;
    setActiveWheel: (wheelType: WheelType | null) => void;
}

export const useWheelDialogStore = create<WheelDialogStoreState>(set => ({
    activeWheel: null,
    setActiveWheel: (wheelType: WheelType | null) => set({ activeWheel: wheelType }),
}));

export const useWheelDialog = () => {
    const openWheel = (wheelType: WheelType) =>
        useWheelDialogStore.getState().setActiveWheel(wheelType);

    return { openWheel };
};
