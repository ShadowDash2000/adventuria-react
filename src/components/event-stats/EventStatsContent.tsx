import { Heading, HStack, Spinner, type StackProps, Text, VStack } from '@chakra-ui/react';
import { Cell } from '@components/board/cells/Cell';
import { ItemIcon } from '@components/items/ItemIcon';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { useQuery } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import type { UserRecord } from '@shared/types/user';
import type { CellRecord } from '@shared/types/cell';
import type { ItemRecord } from '@shared/types/item';
import { useCellsStore } from '@components/board/useCellsStore';

const EVENT_STATS_CONFIG: Record<keyof EventStatsData, { title: string; limit: number }> = {
    most_games_completed: { title: 'Больше всего пройдено игр', limit: 3 },
    most_drops: { title: 'Больше всего дропов', limit: 3 },
    most_rerolls: { title: 'Больше всего рероллов', limit: 3 },
    most_gyms_completed: { title: 'Больше всего качалок', limit: 3 },
    most_movies_watched: { title: 'Больше всего просмотрено фильмов', limit: 3 },
    most_karaoke_completed: { title: 'Больше всего спето песен в караоке', limit: 3 },
    most_wanted: { title: 'Больше всего был в тюрьме', limit: 3 },
    most_items_used: { title: 'Больше всего использовано предметов', limit: 3 },
    most_roblox_played: { title: 'Больше всего играл в Roblox', limit: 3 },
    most_happy_wheels_played: { title: 'Больше всего играл в Happy Wheels', limit: 3 },
    most_visited_cells: { title: 'Самые посещаемые клетки', limit: 6 },
    least_visited_cells: { title: 'Самые не посещаемые клетки', limit: 6 },
    most_used_items: { title: 'Самые используемые предметы', limit: 6 },
};

const CELL_STATS_KEYS: (keyof EventStatsData)[] = ['most_visited_cells', 'least_visited_cells'];
const ITEM_STATS_KEYS: (keyof EventStatsData)[] = ['most_used_items'];

export const EventStatsContent = ({ ...props }: StackProps) => {
    const openCellInfo = useCellsStore(state => state.openCellInfo);

    const eventStats = useQuery({
        queryFn: () => getEventStats(),
        queryKey: ['event-stats'],
        refetchOnWindowFocus: false,
    });

    if (eventStats.isPending) {
        return <Spinner />;
    }

    if (eventStats.isError) {
        const e = eventStats.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    if (!eventStats.data.success) {
        return <Text>Не удалось загрузить статистику</Text>;
    }

    return (
        <VStack align="stretch" gap={4} {...props}>
            {(Object.keys(EVENT_STATS_CONFIG) as (keyof EventStatsData)[]).map(statKey => (
                <VStack key={statKey} align="stretch" gap={4}>
                    <Heading as="h3" textAlign="center">
                        {EVENT_STATS_CONFIG[statKey].title}
                    </Heading>

                    <HStack justify="space-evenly" gap={4} wrap="wrap">
                        {eventStats.data.data[statKey]
                            .slice(0, EVENT_STATS_CONFIG[statKey].limit)
                            .map(({ count, record }) => {
                                if (CELL_STATS_KEYS.includes(statKey)) {
                                    return (
                                        <VStack key={record.id} gap={2}>
                                            <Cell
                                                cell={record as CellRecord}
                                                width="190px"
                                                height="128px"
                                                onClick={() => openCellInfo(record.id)}
                                            />
                                            <VStack align="center" gap={0}>
                                                <Text lineHeight={1}>{record.name}</Text>
                                                <Text lineHeight={1} fontSize="sm" color="gray.400">
                                                    {count}
                                                </Text>
                                            </VStack>
                                        </VStack>
                                    );
                                }

                                if (ITEM_STATS_KEYS.includes(statKey)) {
                                    return (
                                        <HStack key={record.id} gap={2}>
                                            <ItemIcon item={record as ItemRecord} w={32} h={32} />
                                            <VStack align="start" gap={0}>
                                                <Text lineHeight={1}>{record.name}</Text>
                                                <Text lineHeight={1} fontSize="sm" color="gray.400">
                                                    {count}
                                                </Text>
                                            </VStack>
                                        </HStack>
                                    );
                                }

                                return (
                                    <HStack key={record.id} gap={2}>
                                        <PlayerAvatar user={record as UserRecord} w={14} h={14} />
                                        <VStack align="start" gap={0}>
                                            <Text lineHeight={1}>{record.name}</Text>
                                            <Text lineHeight={1} fontSize="sm" color="gray.400">
                                                {count}
                                            </Text>
                                        </VStack>
                                    </HStack>
                                );
                            })}
                    </HStack>
                </VStack>
            ))}
        </VStack>
    );
};

type EventStatsData = {
    most_games_completed: EventUserStatEntry[];
    most_drops: EventUserStatEntry[];
    most_rerolls: EventUserStatEntry[];
    most_gyms_completed: EventUserStatEntry[];
    most_movies_watched: EventUserStatEntry[];
    most_karaoke_completed: EventUserStatEntry[];
    most_wanted: EventUserStatEntry[];
    most_items_used: EventUserStatEntry[];
    most_roblox_played: EventUserStatEntry[];
    most_happy_wheels_played: EventUserStatEntry[];
    most_visited_cells: EventCellStatEntry[];
    least_visited_cells: EventCellStatEntry[];
    most_used_items: EventItemStatEntry[];
};

type EventUserStatEntry = { count: number; record: UserRecord };

type EventCellStatEntry = { count: number; record: CellRecord };

type EventItemStatEntry = { count: number; record: ItemRecord };

type EventStatsSuccess = { success: true; data: EventStatsData; error?: never };

type EventStatsError = { success: false; data: never; error: never };

type EventStatsResult = EventStatsSuccess | EventStatsError;

const getEventStats = async () => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/event-stats`, { method: 'GET' });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to get event stats`);
    }

    return (await res.json()) as EventStatsResult;
};
