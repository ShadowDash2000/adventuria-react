import { type ReactNode } from 'react';
import type { UserRecord } from '@shared/types/user';
import type { CellRecord } from '@shared/types/cell';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import { BoardDataContext } from '.';
import { queryKeys } from '@shared/queryClient';

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const { pb } = useAppContext();
    const users = useQuery({
        queryFn: () =>
            pb
                .collection('users')
                .getFullList<UserRecord>({
                    fields: 'id,updated,name,collectionName,avatar,color,cellsPassed,is_stream_live',
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.users,
    });
    const cells = useQuery({
        queryFn: () =>
            pb
                .collection('cells')
                .getFullList<CellRecord>({ sort: 'sort', filter: 'disabled = false' }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.cells,
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
