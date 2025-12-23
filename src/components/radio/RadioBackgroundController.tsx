import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { useEffect } from 'react';
import { useRadioStore } from './useRadioStore';
import { useRadioPreset } from './useRadioPreset';
import { useRadio } from '@components/radio/useRadio';

export const RadioBackgroundController = () => {
    const { setAudioCount } = useRadioStore();
    const { onEnded } = useAudioPlayer(AudioKey.radio);
    const { audioName, play, pause, isPlaying, prevAudio, nextAudio } = useRadio();

    const { data } = useRadioPreset();

    useEffect(() => {
        if (data?.audio) setAudioCount(data.audio.length);
    }, [data, setAudioCount]);

    useEffect(() => {
        const unsubscribe = onEnded(async () => {
            nextAudio();
        });
        return () => unsubscribe();
    }, [onEnded, nextAudio]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) return;

        if (audioName) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: audioName,
                artist: 'Приключпопия Team',
            });
        }

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => play());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevAudio());
        navigator.mediaSession.setActionHandler('nexttrack', () => nextAudio());

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [isPlaying, audioName, play, pause, prevAudio, nextAudio]);

    return null;
};
