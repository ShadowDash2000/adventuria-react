import { create } from 'zustand/react';

export enum KbdKey {
    inventory = 'KeyI',
    radio = 'KeyP',
}

export type KbdState = { blockedCount: number };

export type KbdSettingsStoreState = {
    kbds: Record<KbdKey, KbdState>;
    incrementBlocked: (key: KbdKey) => void;
    decrementBlocked: (key: KbdKey) => void;
    incrementAll: () => void;
    decrementAll: () => void;
};

export const useKbdSettingsStore = create<KbdSettingsStoreState>()(set => ({
    kbds: {} as Record<KbdKey, KbdState>,

    incrementBlocked: key =>
        set(state => ({
            kbds: {
                ...state.kbds,
                [key]: { ...state.kbds[key], blockedCount: state.kbds[key].blockedCount + 1 },
            },
        })),

    decrementBlocked: key =>
        set(state => ({
            kbds: { ...state.kbds, [key]: { blockedCount: state.kbds[key].blockedCount - 1 } },
        })),

    incrementAll: () =>
        set(state => {
            const newKbds = { ...state.kbds };
            Object.values(KbdKey).forEach(key => {
                newKbds[key] = { blockedCount: (newKbds[key]?.blockedCount ?? 0) + 1 };
            });
            return { kbds: newKbds };
        }),

    decrementAll: () =>
        set(state => {
            const newKbds = { ...state.kbds };
            Object.values(KbdKey).forEach(key => {
                newKbds[key] = { blockedCount: Math.max(0, (newKbds[key]?.blockedCount ?? 0) - 1) };
            });
            return { kbds: newKbds };
        }),
}));

export const useKbdSettings = (key: KbdKey) => {
    const isBlocked = useKbdSettingsStore(state => state.kbds[key]?.blockedCount > 0);
    const incrementBlocked = useKbdSettingsStore(state => state.incrementBlocked);
    const decrementBlocked = useKbdSettingsStore(state => state.decrementBlocked);

    return {
        isBlocked,
        incrementBlocked: () => incrementBlocked(key),
        decrementBlocked: () => decrementBlocked(key),
    };
};
