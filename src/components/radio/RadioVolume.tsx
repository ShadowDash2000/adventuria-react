import { SliderDebounced } from '@ui/slider-debounced';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

export const RadioVolume = () => {
    const { getVolume, setVolume, setVolumeImmediate } = useAudioPlayer(AudioKey.radio);

    return (
        <SliderDebounced
            w={48}
            value={getVolume()}
            setValue={val => setVolume(val)}
            onValueChangeImmediate={val => setVolumeImmediate(val)}
            commitMode="end"
        />
    );
};
