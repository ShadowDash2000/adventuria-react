import { useCollectionListAll } from '@context/CollectionListAllContext';
import { UserRecord } from '@shared/types/user';
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
} from '@chakra-ui/react';
import { Flex } from '@ui/flex';
import { LuChevronUp } from 'react-icons/lu';
import { Avatar } from './Avatar';
import { PlayerInventoryButton } from './inventory/PlayerInventoryButton';
import { Link } from 'react-router-dom';
import { TfiTarget } from 'react-icons/tfi';
import { Tooltip } from '@ui/tooltip';

export const PlayersFloatingList = () => {
    const { data: users } = useCollectionListAll<UserRecord>();

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
            <Collapsible.Root defaultOpen minW="14rem" maxW="16.5rem">
                <Collapsible.Content>
                    <Flex>
                        <VStack p={4} maxH={96} overflowY="auto" w="full" scrollbarWidth="none">
                            <For each={users}>
                                {user => (
                                    <Box key={user.id} w="full">
                                        <HStack minH={14} justify="space-between" align="center">
                                            <ChakraLink asChild minW={0}>
                                                <Link to={`/profile/${user.name}`}>
                                                    <HStack gap={4} minW={0}>
                                                        <Box pos="relative">
                                                            <Avatar
                                                                user={user}
                                                                w={8}
                                                                h={8}
                                                                outlineWidth="0.20vw"
                                                                showStreamLive
                                                            />
                                                        </Box>
                                                        <Text truncate>{user.name}</Text>
                                                    </HStack>
                                                </Link>
                                            </ChakraLink>
                                            <ButtonGroup size="xs">
                                                <PlayerInventoryButton userId={user.id} />
                                                <Tooltip content="Показать игрока">
                                                    <IconButton
                                                        _hover={{ bg: 'orange' }}
                                                        onClick={() =>
                                                            document.dispatchEvent(
                                                                new Event(
                                                                    `player.scroll.${user.id}`,
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
