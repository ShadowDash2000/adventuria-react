import type { UserRecord } from '@shared/types/user';
import { Box, Table, Link as ChakraLink } from '@chakra-ui/react';
import { Avatar } from '@components/Avatar';
import { Link } from 'react-router-dom';

interface LeaderboardItemProps {
    user: UserRecord;
}

export const LeaderboardItem = ({ user }: LeaderboardItemProps) => {
    return (
        <Table.Row bg="none">
            <Table.Cell>
                <Box position="relative" w={12} h={12}>
                    <Avatar user={user} w="full" h="full" showStreamLive />
                </Box>
            </Table.Cell>
            <Table.Cell>
                <ChakraLink asChild>
                    <Link to={`/profile/${user.name}`}>{user.name}</Link>
                </ChakraLink>
            </Table.Cell>
            <Table.Cell>{user.points}</Table.Cell>
            <Table.Cell>{user.stats?.finished || 0}</Table.Cell>
            <Table.Cell>{user.stats?.rerolls || 0}</Table.Cell>
            <Table.Cell>{user.stats?.drops || 0}</Table.Cell>
            <Table.Cell>{user.cellsPassed}</Table.Cell>
        </Table.Row>
    );
};
