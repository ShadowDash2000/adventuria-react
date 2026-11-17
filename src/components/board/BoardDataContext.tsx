import { type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import { BoardDataContext } from '.';
import { activeActorsQueryOptions, cellsBoardQueryOptions } from '@shared/query/requests';

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const activeActors = useQuery({ ...activeActorsQueryOptions(), refetchOnWindowFocus: false });

    const cellsBoard = useQuery({ ...cellsBoardQueryOptions(), refetchOnWindowFocus: false });

    if (activeActors.isPending || cellsBoard.isPending) {
        return <Spinner />;
    }

    if (activeActors.isError) {
        return <Text>Error: {activeActors.error?.message}</Text>;
    }

    if (cellsBoard.isError) {
        return <Text>Error: {cellsBoard.error?.message}</Text>;
    }

    return (
        <BoardDataContext.Provider
            value={{
                activeActors: activeActors.data,
                cells: cellsBoard.data.cells,
                worlds: cellsBoard.data.worlds,
            }}
        >
            {children}
        </BoardDataContext.Provider>
    );
};
