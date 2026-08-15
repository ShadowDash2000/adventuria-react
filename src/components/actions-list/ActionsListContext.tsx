import { createContext, useContext, useState, type ReactNode } from 'react';
import { Flex, type FlexProps } from '@chakra-ui/react';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import type { ListResult } from 'pocketbase';
import { useAppContext } from '@context/AppContext';
import type { ActionRecord } from '@shared/types/action';
import { queryKeys } from '@shared/queryClient';
import { actionSchema, pbCollections } from '@shared/pbSchema';
import { joinExpand } from '@shared/pbExpand';

interface ActionsListProviderProps extends FlexProps {
    children: ReactNode;
    playerId?: string;
    perPage?: number;
}

interface ActionsListContextValue {
    filter: string;
    setFilter: (filter: string) => void;
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
    const [actionFilter, setActionFilter] = useState('');

    const playerFilter = playerId ? `${actionSchema.player} = "${playerId}"` : '';
    const filter = [playerFilter, actionFilter].filter(Boolean).join(' && ');

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
        queryKey: [...queryKeys.actions, filter, perPage],
        initialPageParam: 1,
        placeholderData: keepPreviousData,
        gcTime: 0,
        refetchOnWindowFocus: false,
    });

    return (
        <ActionsListContext.Provider
            value={{
                filter,
                setFilter: setActionFilter,
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
