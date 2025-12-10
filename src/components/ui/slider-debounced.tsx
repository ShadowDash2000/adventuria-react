import { Slider, type SliderRootProps } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

interface SliderDebouncedProps extends Omit<SliderRootProps, 'value'> {
    value: number;
    setValue: (value: number) => void;
    label?: string;
}

export const SliderDebounced = ({ value, setValue, label, ...rest }: SliderDebouncedProps) => {
    const [valueInner, setValueInner] = useState<number>(value);
    const debouncedValue = useDebounce(valueInner, 500);

    useEffect(() => {
        setValue(valueInner);
    }, [debouncedValue]);

    useEffect(() => {
        setValueInner(value);
    }, [value]);

    return (
        <Slider.Root
            {...rest}
            defaultValue={[valueInner]}
            value={[valueInner]}
            onValueChange={e => setValueInner(e.value[0])}
            min={0}
            max={1}
            step={0.01}
        >
            {label && <Slider.Label>{label}</Slider.Label>}
            <Slider.Control>
                <Slider.Track>
                    <Slider.Range />
                </Slider.Track>
                <Slider.Thumbs />
            </Slider.Control>
        </Slider.Root>
    );
};
