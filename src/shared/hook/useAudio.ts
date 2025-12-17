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

export type PlayerState = { volume: number; isPlaying: boolean };

export type AudioStoreState = {
    players: Record<AudioKey, PlayerState>;
    setVolume: (key: AudioKey, volume: number) => void;
    play: (key: AudioKey, url: string) => Promise<void>;
    pause: (key: AudioKey) => void;
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

                set(state => ({
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], volume: clamped },
                    },
                }));
            },

            play: async (key, url) => {
                const { players } = get();
                const volume = players[key]?.volume ?? DEFAULT_VOLUME;

                const audio = getAudioElement(key);
                audio.volume = volume;
                audio.src = url;
                await audio.play();

                set(state => ({
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], isPlaying: true },
                    },
                }));
            },

            pause: key => {
                const audio = getAudioElement(key);
                audio.pause();

                set(state => ({
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], isPlaying: false },
                    },
                }));
            },
        }),
        { name: 'audio-players', partialize: state => ({ players: state.players }) },
    ),
);

export const useAudioPlayer = (key: AudioKey) => {
    const volume = useAudioStore(state => state.players[key]?.volume ?? 0.3);
    const isPlaying = useAudioStore(state => state.players[key]?.isPlaying ?? false);
    const play = useAudioStore(state => state.play);
    const pause = useAudioStore(state => state.pause);
    const setVolumeGlobal = useAudioStore(state => state.setVolume);

    return {
        volume,
        isPlaying,
        play: (url: string) => play(key, url),
        pause: () => pause(key),
        setVolume: (v: number) => setVolumeGlobal(key, v),
    };
};
