import { UserAction } from './UserAction';
import { Flex, For, SegmentGroup, Heading, Spinner, Text, type FlexProps } from '@chakra-ui/react';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import type { ClientResponseError } from 'pocketbase';
import type { ActionRecord } from '@shared/types/action';
import { queryKeys } from '@shared/queryClient';

interface ActionsListProps extends FlexProps {
    userName?: string;
    perPage?: number;
}

export const ActionsList = ({ userName, perPage = 10, ...rest }: ActionsListProps) => {
    const { pb } = useAppContext();
    const [actionType, setActionType] = useState<string | null>('all');

    const filter = [
        { field: 'type', value: actionType === 'all' ? null : actionType },
        { field: 'user.name', value: userName },
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
        queryKey: [...queryKeys.actions, actionType, userName],
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
            <Heading size="2xl">Последние ходы</Heading>
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
            <For each={actions.data.pages}>
                {list => list.items.map(action => <UserAction key={action.id} action={action} />)}
            </For>
            <div ref={bottomRef} style={{ height: '10px' }}></div>
        </Flex>
    );
};
