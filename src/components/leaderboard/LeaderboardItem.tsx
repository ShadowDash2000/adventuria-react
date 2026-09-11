import { Box, Table, Link as ChakraLink } from '@chakra-ui/react';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { PlayerProfileLink } from '@components/profile/Link';
import type { PlayerRecord } from '@shared/types/player';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import type { PlayerStatsRecord } from '@shared/types/player_stats';

interface LeaderboardItemProps {
    player: PlayerRecord;
    playerProgress: PlayerProgressRecord;
    playerStats?: PlayerStatsRecord;
}

export const LeaderboardItem = ({ player, playerProgress, playerStats }: LeaderboardItemProps) => {
    return (
        <Table.Row bg="none">
            <Table.Cell>
                <Box position="relative" w={12} h={12}>
                    <PlayerAvatar player={player} w="full" h="full" showStreamLive />
                </Box>
            </Table.Cell>
            <Table.Cell>
                <ChakraLink asChild>
                    <PlayerProfileLink playerName={player.name}>{player.name}</PlayerProfileLink>
                </ChakraLink>
            </Table.Cell>
            <Table.Cell>{playerProgress.points}</Table.Cell>
            <Table.Cell>{playerStats?.activities?.games_completed || 0}</Table.Cell>
            <Table.Cell>{playerStats?.rerolls || 0}</Table.Cell>
            <Table.Cell>{playerStats?.drops || 0}</Table.Cell>
            <Table.Cell>{playerStats?.cells_passed || 0}</Table.Cell>
            <Table.Cell>{playerProgress.drops_in_a_row}</Table.Cell>
        </Table.Row>
    );
};
