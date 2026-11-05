import { create } from 'zustand/react';
import type { DiceType } from './types';

interface RollDiceStoreState {
    isRolling: boolean;
    pendingRoll: PendingRoll | null;
    setIsRolling: (isRolling: boolean) => void;
    setPendingRoll: (rolls: DiceRoll[], durationSec: number) => void;
    clearPendingRoll: () => void;
}

export type DiceRoll = { dice: DiceType; value: number };

type PendingRoll = { rolls: DiceRoll[]; durationSec: number };

export const useRollDiceStore = create<RollDiceStoreState>(set => ({
    isRolling: false,
    pendingRoll: null,
    setIsRolling: isRolling => set({ isRolling }),
    setPendingRoll: (rolls, durationSec) => set({ pendingRoll: { rolls, durationSec } }),
    clearPendingRoll: () => set({ pendingRoll: null }),
}));

export const useRollDice = () => {
    const isRolling = useRollDiceStore(state => state.isRolling);

    const getIsRolling = () => useRollDiceStore.getState().isRolling;
    const setIsRolling = (isRolling: boolean) =>
        useRollDiceStore.getState().setIsRolling(isRolling);
    const setPendingRoll = (rolls: DiceRoll[], durationSec: number) =>
        useRollDiceStore.getState().setPendingRoll(rolls, durationSec);

    return { isRolling, getIsRolling, setIsRolling, setPendingRoll };
};
