import { create } from 'zustand';

interface RadioState {
    currentAudioIndex: number;
    audioCount: number;
    setAudioCount: (count: number) => void;
    setAudioIndex: (index: number) => void;
    nextIndex: () => void;
    prevIndex: () => void;
}

export const useRadioStore = create<RadioState>((set, get) => ({
    currentAudioIndex: 0,
    audioCount: 1,
    setAudioCount: count => set({ audioCount: count }),
    setAudioIndex: index => set({ currentAudioIndex: index }),
    nextIndex: () => {
        const { currentAudioIndex, audioCount } = get();
        set({ currentAudioIndex: (currentAudioIndex + 1) % audioCount });
    },
    prevIndex: () => {
        const { currentAudioIndex, audioCount } = get();
        set({ currentAudioIndex: (currentAudioIndex - 1 + audioCount) % audioCount });
    },
}));
