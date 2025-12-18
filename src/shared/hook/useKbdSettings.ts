import { create } from 'zustand/react';
import { useEffect } from 'react';

export const enum KbdKey {
    inventory = 'KeyI',
    radio = 'KeyP',
}

export type KbdState = { isBlocked: boolean };

export type KbdSettingsStoreState = {
    kbds: Record<KbdKey, KbdState>;
    setBlocked: (key: KbdKey, isBlocked: boolean) => void;
    setBlockedAll: (isBlocked: boolean) => void;
};

export const useKbdSettingsStore = create<KbdSettingsStoreState>()((set, get) => ({
    kbds: {} as Record<KbdKey, KbdState>,

    setBlocked: (key, isBlocked) =>
        set(state => ({ kbds: { ...state.kbds, [key]: { isBlocked } } })),

    setBlockedAll: isBlocked => {
        set(state => {
            const newKbds = { ...state.kbds };
            (Object.keys(newKbds) as KbdKey[]).forEach(key => {
                newKbds[key] = { isBlocked };
            });
            return { kbds: newKbds };
        });
    },
}));

export const useKbdSettings = (key: KbdKey) => {
    const isBlocked = useKbdSettingsStore(state => state.kbds[key]?.isBlocked ?? false);
    const setBlocked = useKbdSettingsStore(state => state.setBlocked);
    const setBlockedAll = useKbdSettingsStore(state => state.setBlockedAll);

    useEffect(() => {
        const store = useKbdSettingsStore.getState();
        if (!(key in store.kbds)) {
            setBlocked(key, false);
        }
    }, [key, setBlocked]);

    return {
        isBlocked,
        setBlocked: (isBlocked: boolean) => setBlocked(key, isBlocked),
        setBlockedAll,
    };
};
