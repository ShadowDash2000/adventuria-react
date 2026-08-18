import type { PlayerRecord } from '@shared/types/player';
import { PlayerAvatar } from '../PlayerAvatar';
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
    useToken,
} from '@chakra-ui/react';
import { LuTwitch, LuYoutube } from 'react-icons/lu';
import { Flex } from '@theme/flex';
import { Button } from '@theme/button';
import { resolveRelativeImageUrlsFromHtml } from '@shared/helpers/helper';

interface PlayerProfileProps {
    player: PlayerRecord;
}

export const PlayerProfile = ({ player }: PlayerProfileProps) => {
    const lgBreakpoint = useToken('breakpoints', 'lg');

    const stats = player.stats
        ? [
              { label: 'Завершено', value: player.stats.finished },
              { label: 'Рероллов', value: player.stats.rerolls },
              { label: 'Дропов', value: player.stats.drops },
              { label: 'Был в тюрьме', value: player.stats.wasInJail },
              { label: 'Использовано предметов', value: player.stats.itemsUsed },
              { label: 'Бросков кубиков', value: player.stats.diceRolls },
              { label: 'Максимальный бросок кубиков', value: player.stats.maxDiceRoll },
              { label: 'Прокручено колёс', value: player.stats.wheelRolled },
          ]
        : [];

    return (
        <Flex variant="solid" align="center" flexDir="column" py={4} gap={2}>
            <VStack zIndex={1}>
                <VStack w="40%">
                    <Box pos="relative">
                        <PlayerAvatar player={player} w={40} h={40} />
                        {player.is_stream_live && (
                            <Float placement="bottom-end">
                                <Circle bg="red.solid" w={4} h={4} />
                            </Float>
                        )}
                    </Box>
                    <Text>{player.name}</Text>
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
                    {player.twitch && (
                        <Button colorPalette="purple" asChild>
                            <Link
                                href={`https://www.twitch.tv/${player.twitch}`}
                                target="_blank"
                                _hover={{ textDecoration: 'none' }}
                            >
                                <LuTwitch />
                                Twitch
                            </Link>
                        </Button>
                    )}
                    {player.youtube && (
                        <Button colorPalette="red" asChild>
                            <Link
                                href={`https://www.youtube.com/@${player.youtube}`}
                                target="_blank"
                                _hover={{ textDecoration: 'none' }}
                            >
                                <LuYoutube />
                                YouTube
                            </Link>
                        </Button>
                    )}
                </ButtonGroup>
            </VStack>
            <Box
                w="full"
                textAlign="center"
                dangerouslySetInnerHTML={{
                    __html: resolveRelativeImageUrlsFromHtml(
                        player.description,
                        import.meta.env.VITE_PB_URL || '',
                    ),
                }}
                css={{ [`@media (max-width: ${lgBreakpoint})`]: { '& img': { display: 'none' } } }}
            />
        </Flex>
    );
};
