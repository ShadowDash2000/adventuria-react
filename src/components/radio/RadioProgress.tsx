import { RadioProgressText } from '@components/radio/RadioProgressText';
import { RadioProgressSlider } from '@components/radio/RadioProgressSlider';
import { AudioKey, useAudioPlayer } from '@shared/hook/useAudio';

export const RadioProgress = () => {
    const { currentTime, duration, seek, isPlaying } = useAudioPlayer(AudioKey.radio);

    return (
        <>
            <RadioProgressText currentTime={currentTime} duration={duration} />
            <RadioProgressSlider
                currentTime={currentTime}
                duration={duration}
                seek={seek}
                isPlaying={isPlaying}
            />
        </>
    );
};
