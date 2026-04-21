import { type CSSProperties, useEffect, useRef } from 'react';
import { PlayerAvatar } from '../../PlayerAvatar';
import { usePlayerMovement } from './usePlayerMovement';
import { useAnimationControls } from 'framer-motion';
import { Box, type BoxProps } from '@chakra-ui/react';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

interface PlayerProps extends BoxProps {
    player: PlayerRecord;
    playerProgress: PlayerProgressRecord;
}

export const Player = ({ player, playerProgress, ...rest }: PlayerProps) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const controls = useAnimationControls();
    const { position, visible, moving, moveTime } = usePlayerMovement({
        playerProgress: playerProgress,
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

        document.addEventListener(`player.scroll.${player.id}`, handler);
        return () => {
            document.removeEventListener(`player.scroll.${player.id}`, handler);
        };
    }, [controls, player.id]);

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
            <PlayerAvatar player={player} animate={controls} initial={false} />
        </Box>
    );
};
