import { type ReactNode } from 'react';
import type { UserRecord } from '@shared/types/user';
import type { CellRecord } from '@shared/types/cell';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import { BoardDataContext } from '.';

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const { pb } = useAppContext();
    const users = useQuery({
        queryFn: () =>
            pb
                .collection('users')
                .getFullList<UserRecord>({
                    fields: 'id,name,collectionName,avatar,color,cellsPassed',
                }),
        refetchOnWindowFocus: false,
        queryKey: ['users'],
    });
    const cells = useQuery({
        queryFn: () =>
            pb
                .collection('cells')
                .getFullList<CellRecord>({
                    sort: 'sort',
                    expand:
                        'filter.platforms,filter.developers,filter.publishers,' +
                        'filter.genres,filter.tags,filter.themes,filter.activities',
                }),
        refetchOnWindowFocus: false,
        queryKey: ['cells'],
    });

    if (users.isPending || cells.isPending) return <Spinner />;
    if (users.isError) return <Text>Error: {users.error?.message}</Text>;
    if (cells.isError) return <Text>Error: {cells.error?.message}</Text>;

    return (
        <BoardDataContext.Provider value={{ users: users.data, cells: cells.data }}>
            {children}
        </BoardDataContext.Provider>
    );
};
