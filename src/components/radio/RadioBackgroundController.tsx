import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { useEffect } from 'react';
import { useRadioStore } from './useRadioStore';
import { useRadioPreset } from './useRadioPreset';
import { useRadio } from '@components/radio/useRadio';
import { useAppContext } from '@context/AppContext';

export const RadioBackgroundController = () => {
    const { pb } = useAppContext();
    const setTrackList = useRadioStore(state => state.setTrackList);
    const { subscribeEnded } = useAudioPlayer(AudioKey.radio);
    const { isPlaying, currentTrack, play, pause, prev, next } = useRadio();
    const { data } = useRadioPreset();

    useEffect(() => {
        if (!data?.expand?.audio) return;

        setTrackList(
            data.expand.audio.map(audio => ({
                id: audio.id,
                title: audio.name,
                url: pb.files.getURL(audio, audio.audio),
            })),
        );
    }, [data?.expand?.audio, setTrackList]);

    useEffect(() => {
        const unsubscribe = subscribeEnded(async () => {
            next();
        });
        return () => unsubscribe();
    }, [subscribeEnded, next]);

    useEffect(() => {
        if (!('mediaSession' in navigator)) return;

        if (currentTrack) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrack.title,
                artist: 'Приключпопия Team',
            });
        }

        navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => play());
        navigator.mediaSession.setActionHandler('pause', () => pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => prev());
        navigator.mediaSession.setActionHandler('nexttrack', () => next());

        return () => {
            navigator.mediaSession.setActionHandler('play', null);
            navigator.mediaSession.setActionHandler('pause', null);
            navigator.mediaSession.setActionHandler('previoustrack', null);
            navigator.mediaSession.setActionHandler('nexttrack', null);
        };
    }, [isPlaying, currentTrack, play, pause, prev, next]);

    return null;
};
