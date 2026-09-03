import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Spinner, Table, Text } from '@chakra-ui/react';
import { LeaderboardItem } from './LeaderboardItem';
import {
    pbCollections,
    playerProgressSchema,
    playerSchema,
    playerStatsSchema,
} from '@shared/pbSchema';
import { eq } from '@shared/pbFilter';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { PlayerStatsRecord } from '@shared/types/player_stats';

export const LeaderboardContent = ({ ...props }: Table.RootProps) => {
    const { pb, gameState, isGameStateSuccess } = useAppContext();

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    sort: `-${playerProgressSchema.points}`,
                    filter: eq(playerProgressSchema.season, gameState!.season),
                    expand: playerProgressSchema.player,
                    fields: joinExpand(
                        '*',
                        dotExpand('expand', playerProgressSchema.player, playerSchema.id),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.name),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.avatar),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.color),
                        dotExpand('expand', playerProgressSchema.player, 'collectionName'),
                    ),
                }),
        queryKey: [...queryKeys.playersProgress, 'leaderboard', gameState?.season],
        enabled: isGameStateSuccess,
        refetchOnWindowFocus: false,
    });

    const playersStats = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playerStats)
                .getFullList<PlayerStatsRecord>({
                    filter: eq(playerStatsSchema.season, gameState!.season),
                }),
        queryKey: [...queryKeys.playerStats, 'leaderboard', gameState?.season],
        enabled: isGameStateSuccess,
        refetchOnWindowFocus: false,
    });

    if (playersProgress.isPending || playersStats.isPending) {
        return <Spinner />;
    }

    if (playersProgress.isError) {
        return <Text>Error: {playersProgress.error?.message}</Text>;
    }

    if (playersStats.isError) {
        return <Text>Error: {playersStats.error?.message}</Text>;
    }

    const playerStatsMap = new Map<string, PlayerStatsRecord>(
        playersStats.data.map(playerStats => [playerStats.player, playerStats]),
    );

    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row bg="none">
                    <Table.ColumnHeader></Table.ColumnHeader>
                    <Table.ColumnHeader>Никнейм</Table.ColumnHeader>
                    <Table.ColumnHeader>Очков</Table.ColumnHeader>
                    <Table.ColumnHeader>Завершено игр</Table.ColumnHeader>
                    <Table.ColumnHeader>Рероллов</Table.ColumnHeader>
                    <Table.ColumnHeader>Дропов</Table.ColumnHeader>
                    <Table.ColumnHeader>Пройдено клеток</Table.ColumnHeader>
                    <Table.ColumnHeader>Счётчик дропов</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {playersProgress.data.map(playerProgress => (
                    <LeaderboardItem
                        player={playerProgress.expand!.player}
                        playerProgress={playerProgress}
                        playerStats={playerStatsMap.get(playerProgress.expand!.player.id)}
                        key={playerProgress.id}
                    />
                ))}
            </Table.Body>
        </Table.Root>
    );
};
