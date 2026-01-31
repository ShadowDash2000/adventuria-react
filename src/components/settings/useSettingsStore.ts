import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

export type Theme = 'disabled' | 'white' | 'blue';

interface SettingsState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(set => ({ theme: 'disabled', setTheme: (theme: Theme) => set({ theme }) }), {
        name: 'settings',
        partialize: state => ({ theme: state.theme }),
    }),
);
