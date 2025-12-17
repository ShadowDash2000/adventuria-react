import { useAppAuthContext } from '@context/AppContext';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { useQuery } from '@tanstack/react-query';
import type { AudioPresetRecord } from '@shared/types/audio-preset';
import { queryKeys } from '@shared/queryClient';
import { useEffect, useRef } from 'react';

interface RadioReturn {
    play: () => Promise<void>;
    pause: () => void;
    volume: number;
    isPlaying: boolean;
    setVolume: (volume: number) => void;
    prevAudio: () => void;
    nextAudio: () => void;
    audioName: string;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
}

export const useRadio = (): RadioReturn => {
    const { pb } = useAppAuthContext();
    const { volume, setVolume, play: playAudio, pause, isPlaying } = useAudioPlayer(AudioKey.radio);
    const currentAudioIndex = useRef(0);
    const audioCount = useRef(1);

    const audioPreset = useQuery({
        queryFn: async () => {
            return pb
                .collection('audio_presets')
                .getFirstListItem<AudioPresetRecord>('slug = "radio"', { expand: 'audio' });
        },
        refetchOnWindowFocus: false,
        queryKey: queryKeys.radioAudioPreset,
    });

    const play = async () => {
        const currentAudio = audioPreset.data?.expand?.audio[currentAudioIndex.current];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    const prevAudio = async () => {
        currentAudioIndex.current =
            currentAudioIndex.current - 1 === -1
                ? audioCount.current - 1
                : currentAudioIndex.current - 1;

        const currentAudio = audioPreset.data?.expand?.audio[currentAudioIndex.current];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    const nextAudio = async () => {
        currentAudioIndex.current =
            currentAudioIndex.current + 1 === audioCount.current
                ? 0
                : currentAudioIndex.current + 1;

        const currentAudio = audioPreset.data?.expand?.audio[currentAudioIndex.current];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    useEffect(() => {
        if (!audioPreset.data) return;
        audioCount.current = audioPreset.data.audio.length;
    }, [audioPreset.data]);

    return {
        play,
        pause,
        isPlaying,
        prevAudio,
        nextAudio,
        audioName: audioPreset.data?.expand?.audio[currentAudioIndex.current]?.name ?? '',
        volume,
        setVolume,
        isPending: audioPreset.isPending,
        isError: audioPreset.isError,
        error: audioPreset.error,
    };
};
