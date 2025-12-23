import { useAppAuthContext } from '@context/AppContext';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';
import { useEffect } from 'react';
import { useRadioStore } from './useRadioStore';
import { useRadioPreset } from './useRadioPreset';

export const RadioBackgroundController = () => {
    const { pb } = useAppAuthContext();
    const { onEnded, play } = useAudioPlayer(AudioKey.radio);
    const { nextIndex, currentAudioIndex, setAudioCount } = useRadioStore();

    const { data } = useRadioPreset();

    useEffect(() => {
        if (data?.audio) setAudioCount(data.audio.length);
    }, [data, setAudioCount]);

    useEffect(() => {
        const unsubscribe = onEnded(async () => {
            nextIndex();

            const audioList = data?.expand?.audio ?? [];
            const nextAudio = audioList[(currentAudioIndex + 1) % (audioList.length || 1)];
            if (nextAudio) {
                await play(pb.files.getURL(nextAudio, nextAudio.audio));
            }
        });
        return () => unsubscribe();
    }, [onEnded, nextIndex, data, currentAudioIndex, play, pb]);

    return null;
};
