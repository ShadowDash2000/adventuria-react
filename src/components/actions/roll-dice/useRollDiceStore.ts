import { create } from 'zustand/react';

interface RollDiceStoreState {
    isRolling: boolean;
    setIsRolling: (isRolling: boolean) => void;
}

export const useRollDiceStore = create<RollDiceStoreState>(set => ({
    isRolling: false,
    setIsRolling: isRolling => set({ isRolling }),
}));
