import {
    Box,
    HStack,
    IconButton,
    Input,
    InputGroup,
    Stack,
    mergeRefs,
    useControllableState,
    type InputProps,
    type BoxProps,
    type IconButtonProps,
    type StackProps,
} from '@chakra-ui/react';
import { type ReactNode, type Ref, useRef } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

export interface PasswordInputProps extends InputProps {
    ref?: Ref<HTMLInputElement>;
    rootProps?: BoxProps;
    defaultVisible?: boolean;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    visibilityIcon?: { on: ReactNode; off: ReactNode };
}

export const PasswordInput = ({
    rootProps,
    defaultVisible,
    visible: visibleProp,
    onVisibleChange,
    ref,
    visibilityIcon = { on: <LuEye />, off: <LuEyeOff /> },
    disabled,
    ...props
}: PasswordInputProps) => {
    const [visible, setVisible] = useControllableState({
        value: visibleProp,
        defaultValue: defaultVisible || false,
        onChange: onVisibleChange,
    });

    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <InputGroup
            endElement={
                <VisibilityTrigger
                    disabled={disabled}
                    onPointerDown={e => {
                        if (disabled) return;
                        if (e.button !== 0) return;
                        e.preventDefault();
                        setVisible(!visible);
                    }}
                >
                    {visible ? visibilityIcon.off : visibilityIcon.on}
                </VisibilityTrigger>
            }
            {...rootProps}
        >
            <Input {...props} ref={mergeRefs(ref, inputRef)} type={visible ? 'text' : 'password'} />
        </InputGroup>
    );
};

export interface VisibilityTriggerProps extends IconButtonProps {
    ref?: Ref<HTMLButtonElement>;
}

const VisibilityTrigger = (props: VisibilityTriggerProps) => {
    return (
        <IconButton
            tabIndex={-1}
            ref={props.ref}
            me="-2"
            aspectRatio="square"
            size="sm"
            variant="ghost"
            height="calc(100% - {spacing.2})"
            aria-label="Toggle password visibility"
            {...props}
        />
    );
};

export interface PasswordStrengthMeterProps extends StackProps {
    max: number;
    value: number;
    colorPalette?: string;
    label?: ReactNode;
    rootProps?: StackProps;
    barsProps?: BoxProps;
    ref?: Ref<HTMLDivElement>;
}

export const PasswordStrengthMeter = ({ max = 4, value, ...props }: PasswordStrengthMeterProps) => {
    const percent = (value / max) * 100;
    const { label, colorPalette } = getColorPalette(percent);

    return (
        <Stack align="flex-end" gap="1" ref={props.ref} {...props}>
            <HStack width="full" ref={props.ref} {...props}>
                {Array.from({ length: max }).map((_, index) => (
                    <Box
                        key={index}
                        height="1"
                        flex="1"
                        rounded="sm"
                        data-selected={index < value ? '' : undefined}
                        layerStyle="fill.subtle"
                        colorPalette="gray"
                        _selected={{ colorPalette, layerStyle: 'fill.solid' }}
                    />
                ))}
            </HStack>
            {label && <HStack textStyle="xs">{label}</HStack>}
        </Stack>
    );
};

function getColorPalette(percent: number) {
    switch (true) {
        case percent < 33:
            return { label: 'Low', colorPalette: 'red' };
        case percent < 66:
            return { label: 'Medium', colorPalette: 'orange' };
        default:
            return { label: 'High', colorPalette: 'green' };
    }
}
