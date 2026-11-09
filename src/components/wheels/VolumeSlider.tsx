import { SliderDebounced } from '@ui/slider-debounced';
import { useState } from 'react';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

export const VolumeSlider = () => {
    const { getVolume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.music);
    const [volumeLocal, setVolumeLocal] = useState(getVolume());

    return (
        <SliderDebounced
            w="full"
            value={volumeLocal}
            setValue={val => {
                setVolume(val);
                setVolumeLocal(val);
            }}
            onValueChangeImmediate={val => setVolumeImmediate(val)}
            commitMode="end"
            label="Громкость"
            colorPalette="orange"
        />
    );
};
