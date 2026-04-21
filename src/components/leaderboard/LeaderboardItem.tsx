import { Box, Table, Link as ChakraLink } from '@chakra-ui/react';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { Link } from 'react-router-dom';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';

interface LeaderboardItemProps {
    player: PlayerRecord;
    playerProgress: PlayerProgressRecord;
}

export const LeaderboardItem = ({ player, playerProgress }: LeaderboardItemProps) => {
    return (
        <Table.Row bg="none">
            <Table.Cell>
                <Box position="relative" w={12} h={12}>
                    <PlayerAvatar player={player} w="full" h="full" showStreamLive />
                </Box>
            </Table.Cell>
            <Table.Cell>
                <ChakraLink asChild>
                    <Link to={`/profile/${player.name}`}>{player.name}</Link>
                </ChakraLink>
            </Table.Cell>
            <Table.Cell>{playerProgress.points}</Table.Cell>
            <Table.Cell>{playerProgress.stats?.finished || 0}</Table.Cell>
            <Table.Cell>{playerProgress.stats?.rerolls || 0}</Table.Cell>
            <Table.Cell>{playerProgress.stats?.drops || 0}</Table.Cell>
            <Table.Cell>{playerProgress.cells_passed}</Table.Cell>
            <Table.Cell>{playerProgress.drops_in_a_row}</Table.Cell>
        </Table.Row>
    );
};
