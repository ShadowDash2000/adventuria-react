import { Avatar as ChakraAvatar } from '@chakra-ui/react/avatar';
import type { RefObject } from 'react';

interface AvatarProps extends ChakraAvatar.RootProps {
    ref?: RefObject<HTMLDivElement | null>;
    src?: string;
}

export const Avatar = ({ ref, src, ...props }: AvatarProps) => {
    return (
        <ChakraAvatar.Root
            outlineWidth=".25vw"
            outlineOffset="{spacing.0.5}"
            outlineStyle="solid"
            {...props}
            ref={ref}
        >
            <ChakraAvatar.Image src={src} />
        </ChakraAvatar.Root>
    );
};
