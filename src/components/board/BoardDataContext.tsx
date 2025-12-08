import { createContext, ReactNode, useContext } from 'react';
import type { UserRecord } from '@shared/types/user';
import type { CellRecord } from '@shared/types/cell';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import { useQuery } from '@tanstack/react-query';
import { LuLoader } from 'react-icons/lu';
import { Text } from '@chakra-ui/react';

export const BoardDataContext = createContext({
    users: [] as UserRecord[],
    cells: [] as CellRecord[],
});

export const useBoardDataContext = () => useContext(BoardDataContext);

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const { pb } = useAppContext();
    const users = useQuery({
        queryFn: () =>
            pb
                .collection('users')
                .getFullList<UserRecord>({ fields: 'id,collectionName,avatar,color,cellsPassed' }),
        refetchOnWindowFocus: false,
        queryKey: ['users'],
    });
    const cells = useQuery({
        queryFn: () =>
            pb
                .collection('cells')
                .getFullList<CellRecord>({
                    sort: 'sort',
                    fields: 'id,collectionName,icon,sort,name,description,points,coins',
                }),
        refetchOnWindowFocus: false,
        queryKey: ['cells'],
    });

    if (users.isPending || cells.isPending) return <LuLoader />;
    if (users.isError) return <Text>Error: {users.error?.message}</Text>;
    if (cells.isError) return <Text>Error: {cells.error?.message}</Text>;

    return (
        <BoardDataContext.Provider value={{ users: users.data, cells: cells.data }}>
            {children}
        </BoardDataContext.Provider>
    );
};
