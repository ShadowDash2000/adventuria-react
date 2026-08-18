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
import { Link } from 'react-router-dom';
import { TfiTarget } from 'react-icons/tfi';
import { Tooltip } from '@ui/tooltip';
import { Flex } from '@theme/flex';
import { usePlayerFloatingListStore } from '@components/players-floating-list/usePlayersFloatingListStore';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { eq } from '@shared/pbFilter';
import { dotExpand, joinExpand } from '@shared/pbExpand';

export const PlayersFloatingList = () => {
    const { pb, currentSeason, isCurrentSeasonSuccess } = useAppContext();
    const open = usePlayerFloatingListStore(state => state.open);
    const setOpen = usePlayerFloatingListStore(state => state.setOpen);

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    filter: eq(playerProgressSchema.season, currentSeason!),
                    expand: playerProgressSchema.player,
                    fields: joinExpand(
                        playerProgressSchema.id,
                        dotExpand('expand', playerProgressSchema.player, playerSchema.id),
                        dotExpand('expand', playerProgressSchema.player, 'collectionName'),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.name),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.avatar),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.color),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.isStreamLive),
                    ),
                }),
        queryKey: [...queryKeys.playersProgress, 'floating-list', currentSeason],
        enabled: isCurrentSeasonSuccess,
    });

    if (playersProgress.isPending) return <Spinner />;
    if (playersProgress.isError) return <Text>Error: {playersProgress.error?.message}</Text>;

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
                            <For each={playersProgress.data}>
                                {playerProgress => (
                                    <Box key={playerProgress.id} w="full">
                                        <HStack minH={14} justify="space-between" align="center">
                                            <ChakraLink asChild minW={0}>
                                                <Link
                                                    to={`/profile/${playerProgress.expand!.player.name}`}
                                                >
                                                    <HStack gap={4} minW={0}>
                                                        <Box pos="relative">
                                                            <PlayerAvatar
                                                                player={
                                                                    playerProgress.expand!.player
                                                                }
                                                                w={8}
                                                                h={8}
                                                                outlineWidth="0.20vw"
                                                                showStreamLive
                                                            />
                                                        </Box>
                                                        <Text truncate>
                                                            {playerProgress.expand!.player.name}
                                                        </Text>
                                                    </HStack>
                                                </Link>
                                            </ChakraLink>
                                            <ButtonGroup size="xs">
                                                <PlayerInventoryButton
                                                    player={playerProgress.expand!.player}
                                                />
                                                <Tooltip content="Показать игрока">
                                                    <IconButton
                                                        _hover={{ bg: 'orange' }}
                                                        onClick={() =>
                                                            document.dispatchEvent(
                                                                new Event(
                                                                    `player.scroll.${playerProgress.expand!.player.id}`,
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
