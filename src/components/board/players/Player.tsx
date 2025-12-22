import { type CSSProperties, useRef } from 'react';
import type { UserRecord } from '@shared/types/user';
import { Avatar } from '../../Avatar';
import { type AvatarRootProps } from '@chakra-ui/react/avatar';
import { usePlayerMovement } from './usePlayerMovement';

interface PlayerProps extends AvatarRootProps {
    user: UserRecord;
}

export const Player = ({ user, ...rest }: PlayerProps) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const { position, visible, moving, moveTime } = usePlayerMovement({
        user: user,
        playerRef: avatarRef,
    });

    const isVisible = visible || moving;

    return (
        <Avatar
            {...rest}
            ref={avatarRef}
            user={user}
            data-visible={isVisible}
            data-not-visible={!isVisible}
            position="absolute"
            w="40px"
            h="40px"
            transform={`translate(var(--translateX), var(--translateY))`}
            transition="transform var(--transition) ease"
            style={
                {
                    '--transition': `${moveTime}s`,
                    '--translateX': `calc(${position.x}px + ${position.offsetX}%)`,
                    '--translateY': `calc(${position.y}px + ${position.offsetY}%)`,
                } as CSSProperties
            }
            css={{
                '&[data-visible="true"]': { visibility: 'visible' },
                '&[data-not-visible="true"]': { visibility: 'hidden' },
            }}
        />
    );
};
