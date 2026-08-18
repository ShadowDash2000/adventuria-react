import { createContext, useContext, type ReactNode, useState } from 'react';
import { Flex, type FlexProps, Spinner, Text } from '@chakra-ui/react';
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';
import { queryKeys } from '@shared/queryClient';
import { actionSchema, pbCollections, seasonsSchema } from '@shared/pbSchema';
import { joinExpand } from '@shared/pbExpand';
import type { ClientResponseError, ListResult } from 'pocketbase';
import type { ActionRecord } from '@shared/types/action';
import type { SeasonRecord } from '@shared/types/season';

interface ActionsListProviderProps extends FlexProps {
    children: ReactNode;
    playerId?: string;
    perPage?: number;
}

interface ActionsListContextValue {
    setQueryFilter: (queryFilter: string) => void;
    seasonsList: SeasonRecord[];
    pages: ListResult<ActionRecord>[];
    error: Error | null;
    isPending: boolean;
    isError: boolean;
    isFetching: boolean;
    isFetchingNextPage: boolean;
    totalItems: number;
    refetch: () => void;
    fetchNextPage: () => Promise<void>;
}

const ActionsListContext = createContext<ActionsListContextValue | null>(null);

export const useActionsListContext = () => {
    const context = useContext(ActionsListContext);
    if (!context) throw new Error('useActionsListContext must be used inside ActionsListProvider');
    return context;
};

export const ActionsListProvider = ({
    children,
    playerId,
    perPage = 10,
    ...rest
}: ActionsListProviderProps) => {
    const { pb } = useAppContext();
    const [queryFilter, setQueryFilter] = useState('');
    const [filtersReady, setFiltersReady] = useState(false);

    const playerFilter = playerId ? `(${actionSchema.player} = "${playerId}")` : '';
    const filter = [playerFilter, queryFilter].filter(Boolean).join(' && ');

    const actions = useInfiniteQuery({
        queryFn: ({ pageParam }) =>
            pb
                .collection(pbCollections.actions)
                .getList<ActionRecord>(pageParam, perPage, {
                    filter,
                    sort: '-created',
                    expand: joinExpand(
                        actionSchema.activity,
                        actionSchema.cell,
                        actionSchema.player,
                        actionSchema.review,
                    ),
                }),
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (lastPage.page === lastPage.totalPages) return null;
            return lastPageParam + 1;
        },
        enabled: filtersReady,
        queryKey: [...queryKeys.actions, filter, perPage],
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        gcTime: 0,
        refetchOnWindowFocus: false,
    });

    const seasons = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.seasons)
                .getFullList<SeasonRecord>({ sort: `-${seasonsSchema.seasonDateStart}` }),
        queryKey: [...queryKeys.seasons, 'actions-list'],
        refetchOnWindowFocus: false,
    });

    if (seasons.isPending) {
        return (
            <Flex h={48} justify="center" {...rest}>
                <Spinner />
            </Flex>
        );
    }

    if (seasons.isError) {
        const e = seasons.error as ClientResponseError;
        return (
            <Flex h={48} justify="center" {...rest}>
                <Text>{e.message}</Text>
            </Flex>
        );
    }

    return (
        <ActionsListContext.Provider
            value={{
                setQueryFilter: filter => {
                    setQueryFilter(filter);
                    setFiltersReady(true);
                },
                seasonsList: seasons.data,
                pages: actions.data?.pages ?? [],
                error: actions.error,
                isPending: actions.isPending,
                isError: actions.isError,
                isFetching: actions.isFetching,
                isFetchingNextPage: actions.isFetchingNextPage,
                totalItems: actions.data?.pages[0]?.totalItems ?? 0,
                refetch: () => void actions.refetch(),
                fetchNextPage: async () => {
                    if (actions.hasNextPage && !actions.isFetching) await actions.fetchNextPage();
                },
            }}
        >
            <Flex direction="column" gap={4} align="center" {...rest}>
                {children}
            </Flex>
        </ActionsListContext.Provider>
    );
};
