import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import { Spinner, Table, Text } from '@chakra-ui/react';
import { LeaderboardItem } from './LeaderboardItem';
import { pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import { eq } from '@shared/pbFilter';
import type { ClientResponseError } from 'pocketbase';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { dotExpand, joinExpand } from '@shared/pbExpand';

export const LeaderboardContent = ({ ...props }: Table.RootProps) => {
    const { pb, settings, isSettingsSuccess } = useAppContext();

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    sort: `-${playerProgressSchema.points}`,
                    filter: eq(playerProgressSchema.season, settings!.current_season),
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
        queryKey: [...queryKeys.playersProgress, 'leaderboard'],
        enabled: isSettingsSuccess,
        refetchOnWindowFocus: false,
    });

    if (playersProgress.isPending) {
        return <Spinner />;
    }

    if (playersProgress.isError) {
        const e = playersProgress.error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Table.Root {...props}>
            <Table.Header>
                <Table.Row bg="none">
                    <Table.ColumnHeader></Table.ColumnHeader>
                    <Table.ColumnHeader>Никнейм</Table.ColumnHeader>
                    <Table.ColumnHeader>Очков</Table.ColumnHeader>
                    <Table.ColumnHeader>Завершено</Table.ColumnHeader>
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
                        key={playerProgress.id}
                    />
                ))}
            </Table.Body>
        </Table.Root>
    );
};
