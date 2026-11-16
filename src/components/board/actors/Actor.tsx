import { type CSSProperties, type RefObject, useEffect, useRef } from 'react';
import type { ActiveActor } from '@shared/query/requests/active-actors';
import { ActorKind } from '@shared/types/actor';
import { useActorMovement } from './useActorMovement';
import { useAnimate } from 'framer-motion';
import { Box, type BoxProps } from '@chakra-ui/react';
import { MotionBox } from '@shared/components/MotionBox';
import { ActorPlayer } from '@components/board/actors/player/ActorPlayer';
import { ActorNPC } from '@components/board/actors/npc/ActorNPC';

interface ActorProps extends BoxProps {
    actor: ActiveActor;
    zIndexHighlight?: number;
}

export const Actor = ({ actor, zIndexHighlight, ...boxProps }: ActorProps) => {
    const playerRef = useRef<HTMLDivElement | null>(null);

    const [avatarScope, animate] = useAnimate<HTMLDivElement>();
    const animation = useRef<ReturnType<typeof animate> | null>(null);
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { position, visible, moving, moveTime } = useActorMovement({
        actorId: actor.id,
        actorInitialState: {
            currentWorld: actor.current_world,
            cellsPassed: actor.cells_passed,
            updated: new Date(actor.updated).getTime(),
        },
        playerRef: playerRef,
    });

    const isVisible = visible || moving;

    useEffect(() => {
        const handler = () => {
            const avatar = avatarScope.current;
            const player = playerRef.current;

            if (!avatar || !player) return;

            animation.current?.stop();

            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            animation.current = animate(
                avatar,
                { scale: 1.5, filter: 'drop-shadow(0 0 0.5rem black)' },
                { duration: 0.2 },
            );

            if (zIndexHighlight) {
                player.style.zIndex = zIndexHighlight.toString();
            }

            timeout.current = setTimeout(() => {
                animation.current?.stop();
                player.style.removeProperty('z-index');

                animation.current = animate(
                    avatar,
                    { scale: 1, filter: 'unset' },
                    { duration: 0.25 },
                );
            }, 3000);
        };

        document.addEventListener(`player.scroll.${actor.id}`, handler);

        return () => {
            document.removeEventListener(`player.scroll.${actor.id}`, handler);

            if (timeout.current) {
                clearTimeout(timeout.current);
            }

            animation.current?.stop();
        };
    }, [animate, avatarScope, actor.id]);

    return (
        <Box
            {...boxProps}
            ref={playerRef}
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
                <ActorAvatar actor={actor} ref={avatarScope} />
            </MotionBox>
        </Box>
    );
};

interface ActorAvatarProps {
    ref?: RefObject<HTMLDivElement | null>;
    actor: ActiveActor;
}

const ActorAvatar = ({ actor, ref }: ActorAvatarProps) => {
    switch (actor.kind) {
        case ActorKind.Player:
            return <ActorPlayer actor={actor} ref={ref} />;
        case ActorKind.NPC:
            return <ActorNPC actor={actor} ref={ref} />;
    }
};
