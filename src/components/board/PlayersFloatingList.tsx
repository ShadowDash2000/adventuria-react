import { type FC, useState } from 'react';
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
    Float,
    Circle,
    VStack,
} from '@chakra-ui/react';
import { Flex } from '@ui/flex';
import { LuChevronUp } from 'react-icons/lu';
import { Avatar } from '../Avatar';
import { GiSwapBag } from 'react-icons/gi';
import { PlayerInventoryButton } from './inventory/PlayerInventoryButton';
import { Link } from 'react-router-dom';
import { TfiTarget } from 'react-icons/tfi';
import { Tooltip } from '@ui/tooltip';

export const PlayersFloatingList: FC = () => {
    const { data: users } = useCollectionListAll<UserRecord>();

    return (
        <ChakraFlex
            zIndex={60}
            position="fixed"
            left={0}
            pl={4}
            visibility={{ base: 'visible', lgDown: 'hidden' }}
        >
            <Collapsible.Root defaultOpen minW="18rem">
                <Collapsible.Trigger
                    w="100%"
                    py={3}
                    display="flex"
                    gap={2}
                    alignItems="center"
                    justifyContent="start"
                >
                    Игроки
                    <Collapsible.Indicator
                        transition="transform 0.2s"
                        _open={{ transform: 'rotate(180deg)' }}
                    >
                        <LuChevronUp />
                    </Collapsible.Indicator>
                </Collapsible.Trigger>
                <Collapsible.Content>
                    <Flex>
                        <VStack p={5} maxH={96} overflowY="auto">
                            <For each={users}>
                                {user => (
                                    <Box key={user.id} w="full">
                                        <HStack minH={16}>
                                            <ChakraLink w="full" asChild>
                                                <Link to={`/profile/${user.name}`}>
                                                    <HStack gap={4}>
                                                        <Box pos="relative">
                                                            <Avatar user={user} />
                                                            {user.is_stream_live && (
                                                                <Float placement="bottom-end">
                                                                    <Circle
                                                                        bg="red.solid"
                                                                        w={4}
                                                                        h={4}
                                                                    />
                                                                </Float>
                                                            )}
                                                        </Box>
                                                        {user.name}
                                                    </HStack>
                                                </Link>
                                            </ChakraLink>
                                            <PlayerInventoryButton userId={user.id} />
                                            <Tooltip content="Показать игрока">
                                                <IconButton
                                                    _hover={{ bg: 'orange' }}
                                                    onClick={() =>
                                                        document.dispatchEvent(
                                                            new Event(`player.scroll.${user.id}`),
                                                        )
                                                    }
                                                >
                                                    <TfiTarget />
                                                </IconButton>
                                            </Tooltip>
                                        </HStack>
                                        <Separator size="md" borderColor="white" variant="dashed" />
                                    </Box>
                                )}
                            </For>
                        </VStack>
                    </Flex>
                </Collapsible.Content>
            </Collapsible.Root>
        </ChakraFlex>
    );
};
