import type { ComponentProps, RefObject } from 'react';
import { Circle, Float } from '@chakra-ui/react';
import { MotionAvatar } from '@shared/components/MotionAvatar';

interface AvatarProps extends ComponentProps<typeof MotionAvatar> {
    ref?: RefObject<HTMLDivElement | null>;
    avatarUrl: string;
    color: string;
    isStreamLive?: boolean;
    showStreamLive?: boolean;
}

export const PlayerAvatar = ({
    avatarUrl,
    color,
    isStreamLive,
    ref,
    showStreamLive = false,
    ...props
}: AvatarProps) => {
    return (
        <>
            <MotionAvatar
                {...props}
                ref={ref}
                src={avatarUrl}
                outlineWidth="4px"
                outlineColor={color}
                outlineOffset="{spacing.0.5}"
                outlineStyle="solid"
            />
            {isStreamLive && showStreamLive && (
                <Float placement="bottom-end">
                    <Circle bg="red.solid" w={4} h={4} />
                </Float>
            )}
        </>
    );
};
