import type { ActivePlayer } from '@shared/query/requests';
import {
    Box,
    ButtonGroup,
    HStack,
    IconButton,
    Link as ChakraLink,
    Separator,
    Text,
} from '@chakra-ui/react';
import { PlayerProfileLink } from '@components/profile/Link';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { Tooltip } from '@ui/tooltip';
import { TfiTarget } from 'react-icons/tfi';

interface PlayerProps {
    player: ActivePlayer;
}

export const Player = ({ player }: PlayerProps) => {
    return (
        <Box key={player.id} w="full">
            <HStack minH={14} justify="space-between" align="center">
                <ChakraLink asChild minW={0}>
                    <PlayerProfileLink playerName={player.name}>
                        <HStack gap={4} minW={0}>
                            <Box pos="relative">
                                <PlayerAvatar
                                    avatarUrl={player.avatar}
                                    color={player.color}
                                    w={8}
                                    h={8}
                                    outlineWidth="0.20vw"
                                    showStreamLive
                                />
                            </Box>
                            <Text truncate>{player.name}</Text>
                        </HStack>
                    </PlayerProfileLink>
                </ChakraLink>
                <ButtonGroup size="xs">
                    <PlayerInventoryButton playerId={player.id} />
                    <Tooltip content="Показать игрока">
                        <IconButton
                            _hover={{ bg: 'orange' }}
                            onClick={() =>
                                document.dispatchEvent(new Event(`player.scroll.${player.id}`))
                            }
                        >
                            <TfiTarget />
                        </IconButton>
                    </Tooltip>
                </ButtonGroup>
            </HStack>
            <Separator size="md" borderColor="white" variant="dashed" />
        </Box>
    );
};
