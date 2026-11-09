import { AudioKey, useAudioPlayer, useAudioStore } from '@shared/hook/useAudio';
import type { RecordIdString } from '@shared/types/pocketbase';
import { type PlayMode, type Track, useRadioStore } from './useRadioStore';

interface RadioReturn {
    isPlaying: boolean;
    currentTrack: Track | undefined;
    play: () => Promise<void>;
    pause: () => void;
    playById: (id: RecordIdString) => Promise<void>;
    prev: () => void;
    next: () => void;
    shuffle: () => void;
    unshuffle: () => void;
    playMode: PlayMode;
}

export const useRadio = (): RadioReturn => {
    const isPlaying = useAudioStore(state => state.players[AudioKey.radio]?.isPlaying ?? false);
    const play = (url: string) => useAudioStore.getState().play(AudioKey.radio, url);
    const pause = () => useAudioStore.getState().pause(AudioKey.radio);
    const rewind = useRadioStore(state => state.rewind);
    const prev = useRadioStore(state => state.prev);
    const next = useRadioStore(state => state.next);
    const shuffle = useRadioStore(state => state.shuffle);
    const unshuffle = useRadioStore(state => state.unshuffle);
    const playMode = useRadioStore(state => state.playMode);

    const currentTrack = useRadioStore(state => {
        const { trackList, playList, currentIndex } = state;

        const id = playList[currentIndex];

        return id ? trackList.get(id) : undefined;
    });

    const playTrack = async () => {
        if (!currentTrack) return;

        await play(currentTrack.url);
    };

    const playById = async (id: RecordIdString) => {
        const currentTrack = rewind(id);

        if (!currentTrack) return;

        await play(currentTrack.url);
    };

    const prevTrack = async () => {
        const prevTrack = prev();

        if (!prevTrack) return;

        await play(prevTrack.url);
    };

    const nextTrack = async () => {
        const nextTrack = next();

        if (!nextTrack) return;

        await play(nextTrack.url);
    };

    return {
        isPlaying,
        currentTrack,
        play: playTrack,
        pause,
        playById,
        prev: prevTrack,
        next: nextTrack,
        shuffle,
        unshuffle,
        playMode,
    };
};
