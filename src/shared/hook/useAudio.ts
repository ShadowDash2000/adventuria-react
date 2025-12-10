import { create } from 'zustand/react';
import { persist } from 'zustand/middleware';

export const enum AudioKey {
    music = 'music',
    sfx = 'sfx',
    radio = 'radio',
}

const audioElements = new Map<string, HTMLAudioElement>();

export const getAudioElement = (key: AudioKey): HTMLAudioElement => {
    let el = audioElements.get(key);
    if (!el) {
        el = new Audio();
        audioElements.set(key, el);
    }
    return el;
};

export type PlayerState = { volume: number };

export type AudioStoreState = {
    players: Record<AudioKey, PlayerState>;
    setVolume: (key: AudioKey, volume: number) => void;
    play: (key: AudioKey, url: string) => Promise<void>;
};

const DEFAULT_VOLUME = 0.2;

export const useAudioStore = create<AudioStoreState>()(
    persist(
        (set, get) => ({
            players: {} as Record<AudioKey, PlayerState>,

            setVolume: (key, volume) => {
                const clamped = Math.min(1, Math.max(0, volume));
                const audio = getAudioElement(key);
                audio.volume = clamped;

                set(state => ({ players: { ...state.players, [key]: { volume: clamped } } }));
            },

            play: async (key, url) => {
                const { players } = get();
                const volume = players[key]?.volume ?? DEFAULT_VOLUME;

                const audio = getAudioElement(key);
                audio.volume = volume;
                audio.src = url;
                await audio.play();
            },
        }),
        { name: 'audio-players', partialize: state => ({ players: state.players }) },
    ),
);

export const useAudioPlayer = (key: AudioKey) => {
    const volume = useAudioStore(state => state.players[key]?.volume ?? 0.3);
    const play = useAudioStore(state => state.play);
    const setVolumeGlobal = useAudioStore(state => state.setVolume);

    return {
        volume,
        play: (url: string) => play(key, url),
        setVolume: (v: number) => setVolumeGlobal(key, v),
    };
};
