import { create } from 'zustand';

interface RadioState {
    trackList: Map<string, Track>;
    playList: string[];
    currentIndex: number;
    playMode: PlayMode;

    setTrackList: (tracks: Track[]) => void;

    rewind: (id: string) => Track | undefined;
    prev: () => Track | undefined;
    next: () => Track | undefined;

    togglePlayMode: (mode: PlayMode) => void;

    shuffle: () => void;
    unshuffle: () => void;
}

export type Track = { id: string; title: string; url: string };

export enum PlayMode {
    None = 0,
    Shuffle = 1 << 0,
}

export const useRadioStore = create<RadioState>((set, get) => ({
    trackList: new Map(),
    playList: [],
    currentIndex: 0,
    playMode: PlayMode.None,

    setTrackList: tracks => {
        const { playMode } = get();

        const trackList = new Map<string, Track>(tracks.map(track => [track.id, track]));
        let playList = [...trackList.keys()];

        if (hasPlayMode(playMode, PlayMode.Shuffle)) {
            playList = shuffleArray(playList);
        }

        set({ trackList: trackList, playList: playList, currentIndex: 0 });
    },

    rewind: id => {
        const { playList, trackList } = get();

        if (!trackList.has(id)) return;

        const index = playList.indexOf(id);

        if (index === -1) return;

        set({ currentIndex: index });

        return trackList.get(id);
    },
    prev: () => {
        const { trackList, playList, currentIndex } = get();

        if (!playList.length) return;

        const index = (currentIndex - 1 + playList.length) % playList.length;

        set({ currentIndex: index });

        return trackList.get(playList[index]);
    },
    next: () => {
        const { trackList, playList, currentIndex } = get();

        if (!playList.length) return;

        const index = (currentIndex + 1) % playList.length;

        set({ currentIndex: index });

        return trackList.get(playList[index]);
    },

    togglePlayMode: (mode: PlayMode) => {
        const { playMode } = get();

        set({ playMode: playMode ^ mode });
    },

    shuffle: () => {
        const { playList, currentIndex, playMode } = get();

        if (playMode === PlayMode.Shuffle) return;

        const currentId = playList[currentIndex];
        const shuffled = shuffleArray(playList);

        set({
            playMode: PlayMode.Shuffle,
            playList: shuffled,
            currentIndex: currentId ? shuffled.indexOf(currentId) : 0,
        });
    },

    unshuffle: () => {
        const { trackList, playList, currentIndex, playMode } = get();

        if (playMode === PlayMode.None) return;

        const currentId = playList[currentIndex];
        const original = [...trackList.keys()];

        set({
            playMode: PlayMode.None,
            playList: original,
            currentIndex: currentId ? original.indexOf(currentId) : 0,
        });
    },
}));

export const hasPlayMode = (playMode: PlayMode, mode: PlayMode) => (playMode & mode) !== 0;

const shuffleArray = <T>(array: T[]): T[] => {
    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
};
