import { Slider, SliderRootProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

interface VolumeSliderProps extends SliderRootProps {
    volume: number;
    setVolume: (volume: number) => void;
}

export const VolumeSlider = ({ volume, setVolume, ...rest }: VolumeSliderProps) => {
    const [volumeInner, setVolumeInner] = useState<number>(volume);
    const debouncedVolume = useDebounce(volumeInner, 500);

    useEffect(() => {
        setVolume(volumeInner);
    }, [debouncedVolume]);

    useEffect(() => {
        setVolumeInner(volume);
    }, [volume]);

    return (
        <Slider.Root
            {...rest}
            defaultValue={[volumeInner]}
            value={[volumeInner]}
            onValueChange={e => setVolumeInner(e.value[0])}
            min={0}
            max={1}
            step={0.01}
        >
            <Slider.Label>Громкость</Slider.Label>
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
            </Slider.Control>
        </Slider.Root>
    );
};
