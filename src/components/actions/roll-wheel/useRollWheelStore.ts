import { create } from 'zustand';

interface RollWheelStoreState {
    isSpinning: boolean;
    setIsSpinning: (isSpinning: boolean) => void;
}

export const useRollWheelStore = create<RollWheelStoreState>(set => ({
    isSpinning: false,
    setIsSpinning: isSpinning => set({ isSpinning }),
}));
