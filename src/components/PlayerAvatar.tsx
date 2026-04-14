import { ComponentProps, type RefObject } from 'react';
import type { UserRecord } from '@shared/types/user';
import { useAppContext } from '@context/AppContext';
import { Circle, Float } from '@chakra-ui/react';
import { MotionAvatar } from '@shared/components/MotionAvatar';

interface AvatarProps extends ComponentProps<typeof MotionAvatar> {
    ref?: RefObject<HTMLDivElement | null>;
    user: UserRecord;
    showStreamLive?: boolean;
}

export const PlayerAvatar = ({ user, ref, showStreamLive = false, ...props }: AvatarProps) => {
    const { pb } = useAppContext();
    const avatar = pb.files.getURL(user, user.avatar);

    return (
        <>
            <MotionAvatar
                {...props}
                ref={ref}
                src={avatar}
                outlineWidth="4px"
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
