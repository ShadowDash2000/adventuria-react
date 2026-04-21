import { ComponentProps, type RefObject } from 'react';
import type { PlayerRecord } from '@shared/types/player';
import { useAppContext } from '@context/AppContext';
import { Circle, Float } from '@chakra-ui/react';
import { MotionAvatar } from '@shared/components/MotionAvatar';

interface AvatarProps extends ComponentProps<typeof MotionAvatar> {
    ref?: RefObject<HTMLDivElement | null>;
    player: PlayerRecord;
    showStreamLive?: boolean;
}

export const PlayerAvatar = ({ player, ref, showStreamLive = false, ...props }: AvatarProps) => {
    const { pb } = useAppContext();
    const avatar = pb.files.getURL(player, player.avatar);

    return (
        <>
            <MotionAvatar
                {...props}
                ref={ref}
                src={avatar}
                outlineWidth="4px"
                outlineColor={player.color}
                outlineOffset="{spacing.0.5}"
                outlineStyle="solid"
            />
            {player.is_stream_live && showStreamLive && (
                <Float placement="bottom-end">
                    <Circle bg="red.solid" w={4} h={4} />
                </Float>
            )}
        </>
    );
};
