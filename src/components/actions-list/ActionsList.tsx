import { UserAction } from './UserAction';
import {
    Flex,
    For,
    SegmentGroup,
    Heading,
    Spinner,
    Text,
    type FlexProps,
    HStack,
    IconButton,
    Box,
    Select,
    createListCollection,
    Portal,
    Grid,
} from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import type { ClientResponseError } from 'pocketbase';
import type { ActionRecord } from '@shared/types/action';
import { queryKeys } from '@shared/queryClient';
import { TbRefresh } from 'react-icons/tb';

interface ActionsListProps extends FlexProps {
    userName?: string;
    perPage?: number;
}

export const ActionsList = ({ userName, perPage = 10, ...rest }: ActionsListProps) => {
    const { pb } = useAppContext();
    const [actionType, setActionType] = useState<string | null>('all');
    const [cellType, setCellType] = useState<string | null>('all');

    const filter = [
        { field: 'type', value: actionType === 'all' ? null : actionType },
        { field: 'user.name', value: userName },
        { field: 'cell.type', value: cellType === 'all' ? null : cellType },
    ];

    const actions = useInfiniteQuery({
        queryFn: async ({ pageParam }) =>
            await pb.collection('actions').getList<ActionRecord>(pageParam, perPage, {
                filter: filter
                    .filter(f => f.value)
                    .map(f => `${f.field} = "${f.value}"`)
                    .join(' && '),
                sort: '-created',
                expand: 'activity,cell,user',
            }),
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.page === lastPage.totalPages) return null;
            return ++lastPageParam;
        },
        queryKey: [...queryKeys.actions, actionType, userName, cellType],
        initialPageParam: 1,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
    });

    const { ref: bottomRef } = useInView({
        onChange: async inView => {
            if (inView && actions.hasNextPage && !actions.isFetching) {
                await actions.fetchNextPage();
            }
        },
        trackVisibility: true,
        delay: 100,
    });

    if (actions.isPending) {
        return <Spinner />;
    }

    if (actions.isError) {
        const e = actions.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Flex direction="column" gap={4} align="center" {...rest}>
            <HStack>
                <Heading size="2xl">Последние ходы</Heading>
                <IconButton
                    size="xs"
                    bg="none"
                    color="white"
                    disabled={actions.isFetching}
                    _hover={{ cursor: 'pointer' }}
                    onClick={() => actions.refetch()}
                >
                    <Box
                        w="full"
                        h="full"
                        data-loading={actions.isFetching}
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
            <Grid
                templateColumns={{ base: '1fr', md: '1fr auto 1fr' }}
                alignItems="center"
                justifyItems="center"
                gap={8}
                w="full"
            >
                <Text justifySelf={{ base: 'center', md: 'end' }}>
                    Всего: {actions.data.pages ? actions.data.pages[0].totalItems : 0}
                </Text>
                <SegmentGroup.Root
                    defaultValue={actionType}
                    onValueChange={e => setActionType(e.value)}
                >
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items
                        items={[
                            { label: 'Все', value: 'all' },
                            { label: 'Завершено', value: 'done' },
                            { label: 'Дроп', value: 'drop' },
                            { label: 'Реролл', value: 'reroll' },
                            { label: 'Колесо', value: 'rollWheel' },
                        ]}
                    />
                </SegmentGroup.Root>
                <Select.Root
                    size="sm"
                    w={200}
                    justifySelf={{ base: 'center', md: 'start' }}
                    collection={cellTypes}
                    defaultValue={['all']}
                    onValueChange={e => setCellType(e.value[0])}
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText placeholder="Тип действия" />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {cellTypes.items.map(cellType => (
                                    <Select.Item item={cellType} key={cellType.value}>
                                        {cellType.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Grid>
            <For each={actions.data.pages}>
                {list => list.items.map(action => <UserAction key={action.id} action={action} />)}
            </For>
            <div ref={bottomRef} style={{ height: '10px' }}></div>
        </Flex>
    );
};

const cellTypes = createListCollection({
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
