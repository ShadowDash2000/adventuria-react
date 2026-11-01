import { type ReactNode } from 'react';
import type { CellRecord } from '@shared/types/cell';
import type { WorldRecord } from '@shared/types/world';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import { BoardDataContext } from '.';
import { queryKeys } from '@shared/query';
import { activePlayersQueryOptions } from '@shared/query/requests';
import { cellSchema, pbCollections, worldSchema } from '@shared/pbSchema';
import { joinExpand } from '@shared/pbExpand';

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const { pb } = useAppContext();

    const activePlayers = useQuery({ ...activePlayersQueryOptions(), refetchOnWindowFocus: false });

    const cells = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.cells)
                .getFullList<CellRecord>({
                    sort: cellSchema.sort,
                    filter: `${cellSchema.disabled} = false`,
                    fields: joinExpand(
                        'collectionName',
                        cellSchema.id,
                        cellSchema.type,
                        cellSchema.world,
                        cellSchema.icon,
                        cellSchema.cellEvent,
                    ),
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.cells,
    });

    const worlds = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.worlds)
                .getFullList<WorldRecord>({
                    sort: worldSchema.sort,
                    fields: joinExpand(worldSchema.id, worldSchema.sort),
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.worlds,
    });

    if (activePlayers.isPending || cells.isPending || worlds.isPending) return <Spinner />;
    if (activePlayers.isError) return <Text>Error: {activePlayers.error?.message}</Text>;
    if (cells.isError) return <Text>Error: {cells.error?.message}</Text>;
    if (worlds.isError) return <Text>Error: {worlds.error?.message}</Text>;

    return (
        <BoardDataContext.Provider
            value={{ activePlayers: activePlayers.data, cells: cells.data, worlds: worlds.data }}
        >
            {children}
        </BoardDataContext.Provider>
    );
};
