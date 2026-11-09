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

export type PlayerState = { isPlaying: boolean; volume?: number };

export type AudioStoreState = {
    playersPersist: Record<AudioKey, PlayerPersistState>;
    players: Record<AudioKey, PlayerState>;
    setVolume: (key: AudioKey, volume: number) => void;
    setVolumeImmediate: (key: AudioKey, volume: number) => void;
    play: (key: AudioKey, url: string) => Promise<void>;
    pause: (key: AudioKey) => void;
    seek: (key: AudioKey, time: number) => void;
    currentTime: (key: AudioKey) => number;
    duration: (key: AudioKey) => number;
    onTrackEnded: (key: AudioKey) => void;
    onEndedListeners: Record<AudioKey, (() => void)[]>;
    subscribeEnded: (key: AudioKey, callback: () => void) => () => void;
};

export const DEFAULT_VOLUME = 0.2;

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
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], volume: clamped },
                    },
                }));
            },
            setVolumeImmediate: (key, volume) => {
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
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], isPlaying: true, volume },
                    },
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
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], isPlaying: false },
                    },
                }));
            },

            seek: (key, time) => {
                const audio = getAudioElement(key);
                audio.currentTime = time;
            },

            currentTime: key => getAudioElement(key).currentTime,

            duration: key => getAudioElement(key).duration,

            onTrackEnded: key => {
                set(state => ({
                    players: {
                        ...state.players,
                        [key]: { ...state.players[key], isPlaying: false },
                    },
                }));
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
    const isPlaying = useAudioStore(state => state.players[key]?.isPlaying ?? false);
    const play = (url: string) => useAudioStore.getState().play(key, url);
    const pause = () => useAudioStore.getState().pause(key);
    const getVolume = () => {
        const state = useAudioStore.getState();

        return state.players[key]?.volume ?? state.playersPersist[key]?.volume ?? 0.3;
    };
    const setVolume = (volume: number) => useAudioStore.getState().setVolume(key, volume);
    const setVolumeImmediate = (volume: number) =>
        useAudioStore.getState().setVolumeImmediate(key, volume);
    const seek = (time: number) => useAudioStore.getState().seek(key, time);
    const currentTime = () => useAudioStore.getState().currentTime(key);
    const duration = () => useAudioStore.getState().duration(key);
    const subscribeEnded = (callback: () => void) =>
        useAudioStore.getState().subscribeEnded(key, callback);

    return {
        isPlaying,
        play,
        pause,
        getVolume,
        setVolume,
        setVolumeImmediate,
        seek,
        currentTime,
        duration,
        subscribeEnded,
    };
};
