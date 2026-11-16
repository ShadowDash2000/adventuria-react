import { Flex as ChakraFlex, Collapsible, For, VStack, Text, Spinner } from '@chakra-ui/react';
import { LuChevronUp } from 'react-icons/lu';
import { Flex } from '@theme/flex';
import { useActorsFloatingListStore } from '@components/actors-floating-list/usePlayersFloatingListStore';
import { useQuery } from '@tanstack/react-query';
import { activeActorsListQueryOptions } from '@shared/query/requests';
import { Player } from './Player';
import { NPC } from './NPC';

export const ActorsFloatingList = () => {
    const open = useActorsFloatingListStore(state => state.open);
    const setOpen = useActorsFloatingListStore(state => state.setOpen);

    const activePlayers = useQuery({
        ...activeActorsListQueryOptions(),
        refetchOnWindowFocus: false,
    });

    if (activePlayers.isPending) {
        return <Spinner />;
    }

    if (activePlayers.isError) {
        return <Text>Error: {activePlayers.error?.message}</Text>;
    }

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
                            <For each={activePlayers.data.players}>
                                {player => <Player player={player} key={player.id} />}
                            </For>
                            <For each={activePlayers.data.npcs}>
                                {npc => <NPC npc={npc} key={npc.id} />}
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
                    Участники
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
