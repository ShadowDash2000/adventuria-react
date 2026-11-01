import {
    Flex as ChakraFlex,
    Collapsible,
    For,
    Separator,
    HStack,
    IconButton,
    Box,
    Link as ChakraLink,
    VStack,
    ButtonGroup,
    Text,
    Spinner,
} from '@chakra-ui/react';
import { LuChevronUp } from 'react-icons/lu';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { PlayerProfileLink } from '@components/profile/Link';
import { TfiTarget } from 'react-icons/tfi';
import { Tooltip } from '@ui/tooltip';
import { Flex } from '@theme/flex';
import { usePlayerFloatingListStore } from '@components/players-floating-list/usePlayersFloatingListStore';
import { useQuery } from '@tanstack/react-query';
import { activePlayersQueryOptions } from '@shared/query/requests';

export const PlayersFloatingList = () => {
    const open = usePlayerFloatingListStore(state => state.open);
    const setOpen = usePlayerFloatingListStore(state => state.setOpen);

    const activePlayers = useQuery({ ...activePlayersQueryOptions(), refetchOnWindowFocus: false });

    if (activePlayers.isPending) return <Spinner />;
    if (activePlayers.isError) return <Text>Error: {activePlayers.error?.message}</Text>;

    return (
        <ChakraFlex
            zIndex={60}
            position="fixed"
            top={0}
            left={0}
            mt={10}
            pl={4}
            visibility={{ base: 'visible', lgDown: 'hidden' }}
        >
            <Collapsible.Root
                open={open}
                onOpenChange={e => setOpen(e.open)}
                minW="14rem"
                maxW="16.5rem"
            >
                <Collapsible.Content>
                    <Flex variant="solid">
                        <VStack p={4} maxH={96} overflowY="auto" w="full" scrollbarWidth="none">
                            <For each={activePlayers.data}>
                                {player => (
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
                                                            document.dispatchEvent(
                                                                new Event(
                                                                    `player.scroll.${player.id}`,
                                                                ),
                                                            )
                                                        }
                                                    >
                                                        <TfiTarget />
                                                    </IconButton>
                                                </Tooltip>
                                            </ButtonGroup>
                                        </HStack>
                                        <Separator size="md" borderColor="white" variant="dashed" />
                                    </Box>
                                )}
                            </For>
                        </VStack>
                    </Flex>
                </Collapsible.Content>
                <Collapsible.Trigger
                    w="100%"
                    py={3}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    justifyContent="start"
                    cursor="pointer"
                >
                    Игроки
                    <Collapsible.Indicator
                        transition="transform 0.2s"
                        _open={{ transform: 'rotate(180deg)' }}
                    >
                        <LuChevronUp />
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
            </Collapsible.Root>
        </ChakraFlex>
    );
};
