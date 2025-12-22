import type { UserRecord } from '@shared/types/user';
import { Avatar } from '../Avatar';
import { useCollectionOneFilter } from '@context/CollectionOneFilterContext';
import {
    Box,
    ButtonGroup,
    Text,
    Link,
    DataList,
    Float,
    Circle,
    VStack,
    For,
    Heading,
} from '@chakra-ui/react';
import { LuTwitch, LuYoutube } from 'react-icons/lu';
import { TimerSimple } from '@components/timer/TimerSimple';
import { Flex } from '@theme/flex';
import { Button } from '@theme/button';

export const UserProfile = () => {
    const { data: user } = useCollectionOneFilter<UserRecord>();

    const stats = user.stats
        ? [
              { label: 'Завершено', value: user.stats.finished },
              { label: 'Рероллов', value: user.stats.rerolls },
              { label: 'Дропов', value: user.stats.drops },
              { label: 'Был в тюрьме', value: user.stats.wasInJail },
              { label: 'Использовано предметов', value: user.stats.itemsUsed },
              { label: 'Бросков кубиков', value: user.stats.diceRolls },
              { label: 'Максимальный бросок кубиков', value: user.stats.maxDiceRoll },
              { label: 'Прокручено колёс', value: user.stats.wheelRolled },
          ]
        : [];

    return (
        <Flex variant="solid" align="center" flexDir="column" py={4} gap={2}>
            <VStack w="40%">
                <Box pos="relative">
                    <Avatar user={user} />
                    {user.is_stream_live && (
                        <Float placement="bottom-end">
                            <Circle bg="red.solid" w={4} h={4} />
                        </Float>
                    )}
                </Box>
                <Text>{user.name}</Text>
                <VStack gap={0}>
                    <Heading>Таймер</Heading>
                    <TimerSimple userId={user.id} />
                </VStack>
                <Box
                    w="full"
                    textAlign="center"
                    dangerouslySetInnerHTML={{ __html: user.description }}
                />
                {stats && (
                    <DataList.Root orientation="horizontal" w="full">
                        <For each={stats}>
                            {(item, index) => (
                                <DataList.Item key={index} justifyContent="space-between">
                                    <DataList.ItemLabel flex="none">
                                        {item.label}
                                    </DataList.ItemLabel>
                                    <DataList.ItemValue flex="none">
                                        {item.value}
                                    </DataList.ItemValue>
                                </DataList.Item>
                            )}
                        </For>
                    </DataList.Root>
                )}
            </VStack>
            <ButtonGroup>
                {user.twitch && (
                    <Button colorPalette="purple" asChild>
                        <Link
                            href={`https://www.twitch.tv/${user.twitch}`}
                            target="_blank"
                            _hover={{ textDecoration: 'none' }}
                        >
                            <LuTwitch />
                            Twitch
                        </Link>
                    </Button>
                )}
                {user.twitch && (
                    <Button colorPalette="red" asChild>
                        <Link
                            href={`https://www.twitch.tv/${user.twitch}`}
                            target="_blank"
                            _hover={{ textDecoration: 'none' }}
                        >
                            <LuYoutube />
                            YouTube
                        </Link>
                    </Button>
                )}
            </ButtonGroup>
        </Flex>
    );
};
