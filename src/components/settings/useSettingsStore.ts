import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';
import type { Appearance } from '@/theme/theme';

export type Theme = 'disabled' | 'white' | 'blue';

interface SettingsState {
    appearance: Appearance;
    setAppearance: (appearance: Appearance) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    displayCellsNumber: boolean;
    setDisplayCellsNumber: (displayCellsNumber: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        set => ({
            appearance: 'adventuria-4',
            theme: 'disabled',
            displayCellsNumber: true,
            setAppearance: (appearance: Appearance) => set({ appearance }),
            setTheme: (theme: Theme) => set({ theme }),
            setDisplayCellsNumber: (displayCellsNumber: boolean) => set({ displayCellsNumber }),
        }),
        {
            name: 'settings',
            partialize: state => ({
                appearance: state.appearance,
                theme: state.theme,
                displayCellsNumber: state.displayCellsNumber,
            }),
        },
    ),
);
