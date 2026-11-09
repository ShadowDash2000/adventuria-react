import { type CSSProperties, useEffect, useRef } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { PlayerAvatar } from '../../PlayerAvatar';
import { usePlayerMovement } from './usePlayerMovement';
import { useAnimationControls } from 'framer-motion';
import { Box, type BoxProps } from '@chakra-ui/react';
import { MotionBox } from '@shared/components/MotionBox';
import { PlayerProfileLink } from '@components/profile/Link';

interface PlayerProps extends BoxProps {
    playerId: RecordIdString;
    playerName: string;
    avatar: string;
    color: string;
    currenWorld: RecordIdString;
    cellsPassed: number;
    updated?: number;
}

export const Player = ({
    playerId,
    playerName,
    avatar,
    color,
    currenWorld,
    cellsPassed,
    updated,
    ...rest
}: PlayerProps) => {
    const avatarRef = useRef<HTMLDivElement | null>(null);
    const controls = useAnimationControls();
    const { position, visible, moving, moveTime } = usePlayerMovement({
        playerId,
        playerProgress: { currentWorld: currenWorld, cellsPassed, updated },
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

        document.addEventListener(`player.scroll.${playerId}`, handler);
        return () => {
            document.removeEventListener(`player.scroll.${playerId}`, handler);
        };
    }, [controls, playerId]);

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
                <PlayerProfileLink playerName={playerName}>
                    <PlayerAvatar
                        avatarUrl={avatar}
                        color={color}
                        animate={controls}
                        initial={false}
                    />
                </PlayerProfileLink>
            </MotionBox>
        </Box>
    );
};
