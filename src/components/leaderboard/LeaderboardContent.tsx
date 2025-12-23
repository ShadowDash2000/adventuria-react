import { useAppContext } from '@context/AppContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import NotFound from '@components/pages/404';
import { Spinner, Table, Text } from '@chakra-ui/react';
import type { ClientResponseError } from 'pocketbase';
import type { UserRecord } from '@shared/types/user';
import { LeaderboardItem } from './LeaderboardItem';

export const LeaderboardContent = () => {
    const { pb } = useAppContext();

    const users = useQuery({
        queryFn: () => pb.collection('users').getFullList<UserRecord>({ sort: '-points' }),
        queryKey: [...queryKeys.users, 'leaderboard'],
        refetchOnWindowFocus: false,
    });

    if (users.isPending) {
        return <Spinner />;
    }

    if (users.isError) {
        const e = users.error as ClientResponseError;
        if (e.status === 404) return <NotFound />;

        return <Text>Error: {e.message}</Text>;
    }

    return (
        <Table.Root w="full">
            <Table.Header>
                <Table.Row bg="none">
                    <Table.ColumnHeader></Table.ColumnHeader>
                    <Table.ColumnHeader>Никнейм</Table.ColumnHeader>
                    <Table.ColumnHeader>Очков</Table.ColumnHeader>
                    <Table.ColumnHeader>Завершено</Table.ColumnHeader>
                    <Table.ColumnHeader>Рероллов</Table.ColumnHeader>
                    <Table.ColumnHeader>Дропов</Table.ColumnHeader>
                    <Table.ColumnHeader>Пройдено клеток</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {users.data.map(user => (
                    <LeaderboardItem user={user} key={user.id} />
                ))}
            </Table.Body>
        </Table.Root>
    );
};
