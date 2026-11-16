import type { ActiveNPC } from '@shared/query/requests';
import { Box, ButtonGroup, HStack, IconButton, Separator, Text } from '@chakra-ui/react';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { Tooltip } from '@ui/tooltip';
import { TfiTarget } from 'react-icons/tfi';

interface NPCProps {
    npc: ActiveNPC;
}

export const NPC = ({ npc }: NPCProps) => {
    return (
        <Box key={npc.id} w="full">
            <HStack minH={14} justify="space-between" align="center">
                <HStack gap={4} minW={0}>
                    <Box pos="relative">
                        <PlayerAvatar
                            avatarUrl={npc.avatar}
                            color={npc.color}
                            w={8}
                            h={8}
                            outlineWidth="0.20vw"
                            showStreamLive
                        />
                    </Box>
                    <Text truncate>{npc.name}</Text>
                </HStack>
                <ButtonGroup size="xs">
                    <Tooltip content="Показать NPC">
                        <IconButton
                            _hover={{ bg: 'orange' }}
                            onClick={() =>
                                document.dispatchEvent(new Event(`player.scroll.${npc.id}`))
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
