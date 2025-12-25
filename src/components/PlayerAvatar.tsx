import { type RefObject } from 'react';
import { type AvatarRootProps } from '@chakra-ui/react/avatar';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContext';
import { Circle, Float } from '@chakra-ui/react';
import { Avatar } from '@components/Avatar';

interface AvatarProps extends AvatarRootProps {
    ref?: RefObject<HTMLDivElement | null>;
    user: UserRecord;
    showStreamLive?: boolean;
}

export const PlayerAvatar = ({ user, ref, showStreamLive = false, ...props }: AvatarProps) => {
    const { pb } = useAppContext();
    const avatar = pb.files.getURL(user, user.avatar);

    return (
        <>
            <Avatar
                {...props}
                ref={ref}
                src={avatar}
                outlineWidth=".25vw"
                outlineColor={user.color}
                outlineOffset="{spacing.0.5}"
                outlineStyle="solid"
            />
            {user.is_stream_live && showStreamLive && (
                <Float placement="bottom-end">
                    <Circle bg="red.solid" w={4} h={4} />
                </Float>
            )}
        </>
    );
};
