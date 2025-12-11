import type { UserRecord } from '@shared/types/user';
import { Flex } from '@ui/flex';
import { Avatar } from '../Avatar';
import { useCollectionOneFilter } from '@context/CollectionOneFilterContext';
import { Box, ButtonGroup, Text, Link, DataList, Float, Circle } from '@chakra-ui/react';
import { Button } from '@ui/button';
import { LuTwitch, LuYoutube } from 'react-icons/lu';
import { TimerSimple } from '@components/timer/TimerSimple';
import { useAppContext } from '@context/AppContextProvider';

export const UserProfile = () => {
    const { pb } = useAppContext();
    const { data: user } = useCollectionOneFilter<UserRecord>();

    return (
        <Flex align="center" flexDir="column" py={4} gap={2}>
            <Box pos="relative">
                <Avatar user={user} />
                {user.is_stream_live && (
                    <Float placement="bottom-end">
                        <Circle bg="red.solid" w={4} h={4} />
                    </Float>
                )}
            </Box>
            <Text>{user.name}</Text>
            <TimerSimple collection={pb.collection('timers')} userId={user.id} />
            <Box dangerouslySetInnerHTML={{ __html: user.description }} />
            {user.stats && (
                <DataList.Root orientation="horizontal">
                    <DataList.Item>
                        <DataList.ItemLabel>Завершено</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.finished}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Рероллов</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.rerolls}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Дропов</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.drops}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Был в тюрьме</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.wasInJail}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Использовано предметов</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.itemsUsed}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Бросков кубиков</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.diceRolls}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Максимальный бросок кубиков</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.maxDiceRoll}</DataList.ItemValue>
                    </DataList.Item>
                    <DataList.Item>
                        <DataList.ItemLabel>Прокручено колёс</DataList.ItemLabel>
                        <DataList.ItemValue>{user.stats.wheelRolled}</DataList.ItemValue>
                    </DataList.Item>
                </DataList.Root>
            )}
            <ButtonGroup>
                {user.twitch && (
                    <Button
                        colorPalette="{colors.purple}"
                        hoverColorPalette="{colors.purple.hover}"
                        asChild
                    >
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
                    <Button
                        colorPalette="{colors.red}"
                        hoverColorPalette="{colors.purple.red}"
                        asChild
                    >
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
