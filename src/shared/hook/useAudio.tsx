import { useCallback } from 'react';
import { useLocalStorage } from '@uidotdev/usehooks';

export type AudioPlayer = {
    play: (url: string) => Promise<void>;
    setVolume: (volume: number) => void;
    volume: number;
};

export const useAudio = (volumeStorageKey: string, defaultVolume = 0.3): AudioPlayer => {
    const audio = new Audio();
    const [volume, setVolumeStorage] = useLocalStorage(volumeStorageKey, defaultVolume);
    audio.volume = volume;

    const play = useCallback(async (url: string) => {
        audio.src = url;
        await audio.play();
    }, []);

    const setVolume = useCallback((volume: number) => {
        setVolumeStorage(Math.min(1, Math.max(0, volume)));
        audio.volume = volume;
    }, []);

    return { play, setVolume, volume };
};
