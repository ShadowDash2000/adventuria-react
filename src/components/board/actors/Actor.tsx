import { type CSSProperties, useEffect, useRef } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { ActorKind } from '@shared/types/actor';
import { PlayerAvatar } from '../../PlayerAvatar';
import { useActorMovement } from './useActorMovement';
import { useAnimationControls } from 'framer-motion';
import { Box, type BoxProps } from '@chakra-ui/react';
import { MotionBox } from '@shared/components/MotionBox';
import { PlayerProfileLink } from '@components/profile/Link';

interface ActorProps extends BoxProps {
    id: RecordIdString;
    kind: ActorKind;
    name: string;
    avatar: string;
    color: string;
    currenWorld: RecordIdString;
    cellsPassed: number;
    updated?: number;
}

export const Actor = ({
    id,
    kind,
    name,
    avatar,
    color,
    currenWorld,
    cellsPassed,
    updated,
    ...rest
}: ActorProps) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const controls = useAnimationControls();
    const { position, visible, moving, moveTime } = useActorMovement({
        actorId: id,
        actorInitialState: { currentWorld: currenWorld, cellsPassed, updated },
        playerRef: avatarRef,
    });

    const isVisible = visible || moving;

    useEffect(() => {
        const highlightPlayer = async () => {
            controls.stop();
            await controls.start({
                scale: 1.5,
                filter: 'drop-shadow(0 0 0.5rem black)',
                transition: { duration: 0.2 },
            });

            window.setTimeout(() => {
                void controls.start({ scale: 1, filter: 'unset', transition: { duration: 0.25 } });
            }, 3000);
        };

        const handler = () => {
            void highlightPlayer();
        };

        document.addEventListener(`player.scroll.${id}`, handler);
        return () => {
            document.removeEventListener(`player.scroll.${id}`, handler);
        };
    }, [controls, id]);

    return (
        <Box
            {...rest}
            ref={avatarRef}
            data-visible={isVisible}
            data-not-visible={!isVisible}
            position="absolute"
            w="40px"
            h="40px"
            transform="translate(var(--translateX), var(--translateY))"
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
        >
            <MotionBox whileHover={{ scale: 1.1 }}>
                {(kind === ActorKind.Player && (
                    <PlayerProfileLink playerName={name}>
                        <PlayerAvatar
                            avatarUrl={avatar}
                            color={color}
                            animate={controls}
                            initial={false}
                        />
                    </PlayerProfileLink>
                )) || (
                    <PlayerAvatar
                        avatarUrl={avatar}
                        color={color}
                        animate={controls}
                        initial={false}
                    />
                )}
            </MotionBox>
        </Box>
    );
};
