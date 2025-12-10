import { type FC, useRef } from 'react';
import type { UserRecord } from '@shared/types/user';
import { Avatar } from '../../Avatar';
import { type AvatarRootProps } from '@chakra-ui/react/avatar';
import { usePlayerMovement } from './usePlayerMovement';

interface PlayerProps extends AvatarRootProps {
    user: UserRecord;
}

export const Player: FC<PlayerProps> = ({ user, ...rest }) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const { position, visible, moving, moveTime } = usePlayerMovement({
        user: user,
        playerRef: avatarRef,
    });

    return (
        <Avatar
            {...rest}
            ref={avatarRef}
            user={user}
            visibility={visible || moving ? 'visible' : 'hidden'}
            position="absolute"
            transform={`translate(calc(${position.x}px + ${position.offsetX}%), calc(${position.y}px + ${position.offsetY}%))`}
            transition={`transform ${moveTime}s ease`}
        />
    );
};
