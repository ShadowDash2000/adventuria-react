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
        el.onended = () => {
            useAudioStore.getState().onTrackEnded(key);
        };
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
    onTrackEnded: (key: AudioKey) => void;
    onEndedListeners: Record<AudioKey, (() => void)[]>;
    subscribeEnded: (key: AudioKey, callback: () => void) => () => void;
};

const DEFAULT_VOLUME = 0.2;

export const useAudioStore = create<AudioStoreState>()(
    persist(
        (set, get) => ({
            playersPersist: {} as Record<AudioKey, PlayerPersistState>,
            players: {} as Record<AudioKey, PlayerState>,
            onEndedListeners: {} as Record<AudioKey, (() => void)[]>,

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

            onTrackEnded: key => {
                set(state => ({ players: { ...state.players, [key]: { isPlaying: false } } }));
                const listeners = get().onEndedListeners[key] || [];
                listeners.forEach(cb => cb());
            },

            subscribeEnded: (key, callback) => {
                set(state => ({
                    onEndedListeners: {
                        ...state.onEndedListeners,
                        [key]: [...(state.onEndedListeners[key] || []), callback],
                    },
                }));
                return () => {
                    set(state => ({
                        onEndedListeners: {
                            ...state.onEndedListeners,
                            [key]: (state.onEndedListeners[key] || []).filter(
                                cb => cb !== callback,
                            ),
                        },
                    }));
                };
            },
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
    const subscribeEnded = useAudioStore(state => state.subscribeEnded);

    return {
        volume,
        isPlaying,
        play: (url: string) => play(key, url),
        pause: () => pause(key),
        setVolume: (v: number) => setVolumeGlobal(key, v),
        seek: (time: number) => seek(key, time),
        currentTime: () => currentTime(key),
        duration: () => duration(key),
        onEnded: (callback: () => void) => subscribeEnded(key, callback),
    };
};
