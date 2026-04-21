import { type ReactNode } from 'react';
import type { PlayerRecord } from '@shared/types/player';
import type { CellRecord } from '@shared/types/cell';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@chakra-ui/react';
import { BoardDataContext } from '.';
import { queryKeys } from '@shared/queryClient';
import { cellSchema, pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import { joinExpand } from '@shared/pbExpand';
import { eq } from '@shared/pbFilter';

export const BoardDataProvider = ({ children }: { children: ReactNode }) => {
    const { pb, settings, isSettingsSuccess, isSettingsError, settingsError } = useAppContext();

    const players = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.players)
                .getFullList<PlayerRecord>({
                    fields: joinExpand(
                        playerSchema.id,
                        'updated',
                        playerSchema.name,
                        'collectionName',
                        playerSchema.avatar,
                        playerSchema.color,
                        playerSchema.isStreamLive,
                    ),
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.players,
    });

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    filter: eq(playerProgressSchema.season, settings!.current_season),
                    fields: joinExpand(
                        playerProgressSchema.id,
                        playerProgressSchema.player,
                        playerProgressSchema.cellsPassed,
                        'updated',
                        'collectionName',
                    ),
                }),
        refetchOnWindowFocus: false,
        enabled: isSettingsSuccess,
        queryKey: queryKeys.playersProgress,
    });

    const cells = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.cells)
                .getFullList<CellRecord>({
                    sort: cellSchema.sort,
                    filter: `${cellSchema.disabled} = false`,
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.cells,
    });

    if (isSettingsError) return <Text>Error: {settingsError?.message}</Text>;
    if (players.isPending || playersProgress.isPending || cells.isPending) return <Spinner />;
    if (players.isError) return <Text>Error: {players.error?.message}</Text>;
    if (playersProgress.isError) return <Text>Error: {playersProgress.error?.message}</Text>;
    if (cells.isError) return <Text>Error: {cells.error?.message}</Text>;

    return (
        <BoardDataContext.Provider
            value={{
                players: players.data,
                playersProgress: playersProgress.data,
                cells: cells.data,
            }}
        >
            {children}
        </BoardDataContext.Provider>
    );
};
