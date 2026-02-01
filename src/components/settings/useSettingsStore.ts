import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

export type Theme = 'disabled' | 'white' | 'blue';

interface SettingsState {
    theme: Theme;
    displayCellsNumber: boolean;
    setTheme: (theme: Theme) => void;
    setDisplayCellsNumber: (displayCellsNumber: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        set => ({
            theme: 'disabled',
            displayCellsNumber: true,
            setTheme: (theme: Theme) => set({ theme }),
            setDisplayCellsNumber: (displayCellsNumber: boolean) => set({ displayCellsNumber }),
        }),
        {
            name: 'settings',
            partialize: state => ({
                theme: state.theme,
                displayCellsNumber: state.displayCellsNumber,
            }),
        },
    ),
);
