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

export type PlayerPersistState = { volume: number };

export type PlayerState = { isPlaying: boolean };

export type AudioStoreState = {
    playersPersist: Record<AudioKey, PlayerPersistState>;
    players: Record<AudioKey, PlayerState>;
    setVolume: (key: AudioKey, volume: number) => void;
    play: (key: AudioKey, url: string) => Promise<void>;
    pause: (key: AudioKey) => void;
    seek: (key: AudioKey, time: number) => void;
    currentTime: (key: AudioKey) => number;
    duration: (key: AudioKey) => number;
};

const DEFAULT_VOLUME = 0.2;

export const useAudioStore = create<AudioStoreState>()(
    persist(
        (set, get) => ({
            playersPersist: {} as Record<AudioKey, PlayerPersistState>,

            players: {} as Record<AudioKey, PlayerState>,

            setVolume: (key, volume) => {
                const clamped = Math.min(1, Math.max(0, volume));
                const audio = getAudioElement(key);
                audio.volume = clamped;

                set(state => ({
                    playersPersist: {
                        ...state.playersPersist,
                        [key]: { ...state.playersPersist[key], volume: clamped },
                    },
                }));
            },

            play: async (key, url) => {
                const { playersPersist } = get();
                const volume = playersPersist[key]?.volume ?? DEFAULT_VOLUME;

                const audio = getAudioElement(key);
                audio.volume = volume;
                if (audio.src !== url) {
                    audio.src = url;
                }
                await audio.play();

                set(state => ({
                    playersPersist: {
                        ...state.playersPersist,
                        [key]: { ...state.playersPersist[key] },
                    },
                    players: { ...state.players, [key]: { isPlaying: true } },
                }));
            },

            pause: key => {
                const audio = getAudioElement(key);
                audio.pause();

                set(state => ({
                    playersPersist: {
                        ...state.playersPersist,
                        [key]: { ...state.playersPersist[key] },
                    },
                    players: { ...state.players, [key]: { isPlaying: false } },
                }));
            },

            seek: (key, time) => {
                const audio = getAudioElement(key);
                audio.currentTime = time;
            },

            currentTime: key => getAudioElement(key).currentTime,

            duration: key => getAudioElement(key).duration,
        }),
        { name: 'audio-players', partialize: state => ({ playersPersist: state.playersPersist }) },
    ),
);

export const useAudioPlayer = (key: AudioKey) => {
    const volume = useAudioStore(state => state.playersPersist[key]?.volume ?? 0.3);
    const isPlaying = useAudioStore(state => state.players[key]?.isPlaying ?? false);
    const play = useAudioStore(state => state.play);
    const pause = useAudioStore(state => state.pause);
    const setVolumeGlobal = useAudioStore(state => state.setVolume);
    const seek = useAudioStore(state => state.seek);
    const currentTime = useAudioStore(state => state.currentTime);
    const duration = useAudioStore(state => state.duration);

    return {
        volume,
        isPlaying,
        play: (url: string) => play(key, url),
        pause: () => pause(key),
        setVolume: (v: number) => setVolumeGlobal(key, v),
        seek: (time: number) => seek(key, time),
        currentTime: () => currentTime(key),
        duration: () => duration(key),
    };
};
