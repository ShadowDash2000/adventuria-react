import { useRef, useState } from 'react';
import { useIntervalWhen } from '@shared/hook/useIntervalWhen';
import { Slider } from '@chakra-ui/react';

interface RadioProgressProps {
    currentTime: () => number;
    duration: () => number;
    seek: (time: number) => void;
    isPlaying: boolean;
}

export const RadioProgress = ({ currentTime, duration, seek, isPlaying }: RadioProgressProps) => {
    const [value, setValue] = useState(0);
    const isDragging = useRef(false);

    useIntervalWhen(
        () => {
            if (isDragging.current) return;

            setValue((currentTime() / duration()) * 100);
        },
        { ms: 300, when: isPlaying, startImmediately: true },
    );

    return (
        <Slider.Root
            w={350}
            value={[value]}
            min={0}
            max={100}
            step={0.01}
            onValueChange={({ value }) => {
                setValue(value[0]);
            }}
            onValueChangeEnd={({ value }) => {
                if (!duration()) return;
                seek((value[0] / 100) * duration());
                isDragging.current = false;
            }}
        >
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs
                    onPointerDown={() => {
                        isDragging.current = true;
                    }}
                />
            </Slider.Control>
        </Slider.Root>
    );
};
