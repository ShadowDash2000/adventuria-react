import { Slider, type SliderRootProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

interface SliderDebouncedProps extends Omit<SliderRootProps, 'value'> {
    value: number;
    setValue: (value: number) => void;
    label?: string;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onValueChangeImmediate?: (value: number) => void;
    commitMode?: 'debounce' | 'end';
}

export const SliderDebounced = ({
    value,
    setValue,
    label,
    onDragStart,
    onDragEnd,
    onValueChangeEnd,
    onValueChangeImmediate,
    commitMode = 'debounce',
    ...rest
}: SliderDebouncedProps) => {
    const [valueInner, setValueInner] = useState<number>(value);
    const debouncedValue = useDebounce(valueInner, 500);

    useEffect(() => {
        if (commitMode !== 'debounce') return;
        setValue(valueInner);
    }, [debouncedValue, commitMode]);

    useEffect(() => {
        setValueInner(value);
    }, [value]);

    return (
        <Slider.Root
            {...rest}
            defaultValue={[valueInner]}
            value={[valueInner]}
            onValueChange={e => {
                const nextValue = e.value[0];
                setValueInner(nextValue);
                onValueChangeImmediate?.(nextValue);
            }}
            onValueChangeEnd={e => {
                onValueChangeEnd?.(e);
                onDragEnd?.();
                if (commitMode === 'end') {
                    setValue(e.value[0]);
                }
            }}
            min={0}
            max={1}
            step={0.01}
        >
            {label && <Slider.Label>{label}</Slider.Label>}
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs
                    onPointerDown={() => {
                        onDragStart?.();
                    }}
                />
            </Slider.Control>
        </Slider.Root>
    );
};
