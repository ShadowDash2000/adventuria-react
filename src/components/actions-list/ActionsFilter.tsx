import { useEffect, useState } from 'react';
import {
    Box,
    createListCollection,
    Grid,
    Heading,
    HStack,
    IconButton,
    Portal,
    Select,
    Text,
} from '@chakra-ui/react';
import { TbRefresh } from 'react-icons/tb';
import { useActionsListContext } from './ActionsListContext';
import { dotExpand } from '@shared/pbExpand';
import { actionSchema, cellSchema } from '@shared/pbSchema';

export const ActionsFilter = () => {
    const { setQueryFilter, seasonsList, totalItems, isFetching, refetch } =
        useActionsListContext();

    const [actionStatuses, setActionStatuses] = useState<string[]>([]);
    const actionStatusesFilter =
        actionStatuses.length > 0
            ? actionStatuses.map(status => `${actionSchema.status} = "${status}"`).join(' || ')
            : '';

    const [cellTypes, setCellTypes] = useState<string[]>([]);
    const cellTypesFilter =
        cellTypes.length > 0
            ? cellTypes
                  .map(type => `${dotExpand(actionSchema.cell, cellSchema.type)} = "${type}"`)
                  .join(' || ')
            : '';

    const seasonsMap = new Map(seasonsList.map(season => [season.id, season]));
    const [seasonId, setSeasonId] = useState<string>(
        seasonsList.length > 0 ? seasonsList[0].id : 'all',
    );
    const [seasonFilter, setSeasonFilter] = useState<string>(
        seasonsMap.has(seasonId)
            ? () => {
                  const season = seasonsMap.get(seasonId)!;
                  return buildSeasonFilter(season.season_date_start, season.season_date_end);
              }
            : '',
    );

    useEffect(() => {
        setQueryFilter(
            [actionStatusesFilter, cellTypesFilter, seasonFilter]
                .filter(Boolean)
                .map(val => `(${val})`)
                .join(' && '),
        );
    }, [actionStatusesFilter, cellTypesFilter, seasonFilter]);

    const seasonsCollection = createListCollection({
        items: [
            { label: 'Все', value: 'all' },
            ...seasonsList.map(season => ({ label: season.name, value: season.id })),
        ],
    });

    return (
        <>
            <HStack>
                <Heading size="2xl">Последние ходы</Heading>
                <IconButton
                    size="xs"
                    bg="none"
                    color="white"
                    disabled={isFetching}
                    _hover={{ cursor: 'pointer' }}
                    onClick={refetch}
                >
                    <Box
                        w="full"
                        h="full"
                        data-loading={isFetching}
                        css={{
                            '&[data-loading="true"]': {
                                animation: 'spin 1s linear infinite reverse',
                            },
                        }}
                    >
                        <TbRefresh style={{ width: '100%', height: '100%' }} />
                    </Box>
                </IconButton>
            </HStack>
            <Text>Всего: {totalItems}</Text>
            <Grid
                templateColumns={{ base: '1fr', md: '1fr auto 1fr' }}
                alignItems="center"
                justifyItems="center"
                gap={8}
                w="full"
            >
                <Select.Root
                    size="sm"
                    w={200}
                    justifySelf={{ base: 'center', md: 'end' }}
                    multiple
                    closeOnSelect={false}
                    collection={actionStatusesList}
                    value={actionStatuses.length === 0 ? ['all'] : actionStatuses}
                    onValueChange={e => {
                        if (
                            e.value.length === 0 ||
                            (actionStatuses.length > 0 && e.value.includes('all'))
                        ) {
                            setActionStatuses([]);
                        } else {
                            setActionStatuses(e.value.filter(val => val !== 'all'));
                        }
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Статус действия</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {actionStatusesList.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Select.Root
                    size="sm"
                    w={200}
                    justifySelf={{ base: 'center', md: 'center' }}
                    multiple
                    closeOnSelect={false}
                    collection={cellTypesList}
                    value={cellTypes.length === 0 ? ['all'] : cellTypes}
                    onValueChange={e => {
                        if (
                            e.value.length === 0 ||
                            (cellTypes.length > 0 && e.value.includes('all'))
                        ) {
                            setCellTypes([]);
                        } else {
                            setCellTypes(e.value.filter(val => val !== 'all'));
                        }
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Тип действия</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {cellTypesList.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
                <Select.Root
                    size="sm"
                    w={200}
                    justifySelf={{ base: 'center', md: 'start' }}
                    collection={seasonsCollection}
                    value={[seasonId]}
                    onValueChange={e => {
                        setSeasonId(e.value[0]);
                        if (e.value[0] === 'all') {
                            setSeasonFilter('');
                        } else {
                            const season = seasonsMap.get(e.value[0])!;
                            setSeasonFilter(
                                buildSeasonFilter(season.season_date_start, season.season_date_end),
                            );
                        }
                    }}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Сезон</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {seasonsCollection.items.map(item => (
                                    <Select.Item item={item} key={item.value}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Grid>
        </>
    );
};

const actionStatusesList = createListCollection({
    items: [
        { label: 'Все', value: 'all' },
        { label: 'Завершено', value: 'done' },
        { label: 'Дроп', value: 'drop' },
        { label: 'Реролл', value: 'reroll' },
        { label: 'Колесо', value: 'roll_wheel' },
    ],
});

const cellTypesList = createListCollection({
    items: [
        { label: 'Все', value: 'all' },
        { label: 'Игры', value: 'game' },
        { label: 'Фильмы', value: 'movie' },
        { label: 'Тюрьма', value: 'jail' },
        { label: 'Качалки', value: 'gym' },
        { label: 'Буфет', value: 'shop' },
        { label: 'Казик', value: 'casino' },
        { label: 'Лестницы/Ямы', value: 'teleport' },
        { label: 'Бафы/Дебафы', value: 'rollItem' },
    ],
});

function buildSeasonFilter(from: string, to: string) {
    return [`created >= "${from}"`, `created <= "${to}"`].join(' && ');
}
