import { useAppAuthContext } from '@context/AppContext';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import type { AudioRecord } from '@shared/types/audio';
import type { RecordIdString } from '@shared/types/pocketbase';
import { useRadioStore } from './useRadioStore';
import { useRadioPreset } from './useRadioPreset';

interface RadioReturn {
    play: () => Promise<void>;
    playById: (id: RecordIdString) => Promise<void>;
    pause: () => void;
    volume: number;
    isPlaying: boolean;
    setVolume: (volume: number) => void;
    prevAudio: () => void;
    nextAudio: () => void;
    seek: (time: number) => void;
    currentTime: () => number;
    duration: () => number;
    audioId: RecordIdString;
    audioName: string;
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    audio: AudioRecord[];
}

export const useRadio = (): RadioReturn => {
    const { pb } = useAppAuthContext();
    const {
        volume,
        setVolume,
        play: playAudio,
        pause,
        isPlaying,
        seek,
        currentTime,
        duration,
    } = useAudioPlayer(AudioKey.radio);
    const { currentAudioIndex, setAudioIndex, prevIndex, nextIndex } = useRadioStore();

    const audioPreset = useRadioPreset();

    const audioByIndex = audioPreset.data?.expand?.audio ?? [];
    const audioIdToIndex = audioByIndex.reduce<Record<RecordIdString, number>>(
        (acc, audio, currentIndex) => {
            acc[audio.id] = currentIndex;
            return acc;
        },
        {},
    );

    const play = async () => {
        const currentAudio = audioByIndex[currentAudioIndex];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    const playById = async (id: RecordIdString) => {
        const audioIndex = audioIdToIndex[id] ?? undefined;
        if (audioIndex === undefined) return;
        const currentAudio = audioByIndex[audioIndex];
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
        setAudioIndex(audioIndex);
    };

    const prevAudio = async () => {
        prevIndex();
        const { currentAudioIndex: newIndex } = useRadioStore.getState();
        const currentAudio = audioByIndex[newIndex];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    const nextAudio = async () => {
        nextIndex();
        const { currentAudioIndex: newIndex } = useRadioStore.getState();
        const currentAudio = audioByIndex[newIndex];
        if (!currentAudio) return;
        await playAudio(pb.files.getURL(currentAudio, currentAudio.audio));
    };

    return {
        play,
        playById,
        pause,
        isPlaying,
        prevAudio,
        nextAudio,
        audioId: audioByIndex[currentAudioIndex]?.id ?? '',
        audioName: audioByIndex[currentAudioIndex]?.name ?? '',
        volume,
        setVolume,
        seek,
        currentTime,
        duration,
        isPending: audioPreset.isPending,
        isError: audioPreset.isError,
        error: audioPreset.error,
        audio: audioPreset.data?.expand?.audio ?? [],
    };
};
