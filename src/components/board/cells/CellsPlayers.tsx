import type { CellPosition } from '@components/board/BoardHelper';
import type { ActivePlayer } from '@shared/query/requests';
import { usePlayersStore } from '../players/usePlayersStore';
import { For, HStack, IconButton, VStack, Text, Box } from '@chakra-ui/react';
import { ToggleTip } from '@ui/toggle-tip';
import { PlayerAvatar } from '../../PlayerAvatar';
import { CELL_MAX_PLAYERS } from '../Board';

interface CellsPlayersProps {
    activePlayers: ActivePlayer[];
    cellWidth: number;
    cellHeight: number;
}

export const CellsPlayers = ({ activePlayers, cellWidth, cellHeight }: CellsPlayersProps) => {
    const playerStates = usePlayersStore(state => state.playerStates);
    const playersById = new Map(activePlayers.map(player => [player.id, player]));
    const cells = new Map<string, { position: CellPosition; players: ActivePlayer[] }>();

    const orderedPlayers = Array.from(playerStates.entries()).sort(
        ([aId, a], [bId, b]) => a.updated - b.updated || aId.localeCompare(bId),
    );

    for (const [playerId, state] of orderedPlayers) {
        const player = playersById.get(playerId);
        if (!player) continue;

        const { worldId, row, col } = state.cellPosition;
        const key = JSON.stringify([worldId, row, col]);
        const cell = cells.get(key);
        if (cell) {
            cell.players.push(player);
        } else {
            cells.set(key, { position: state.cellPosition, players: [player] });
        }
    }

    const cellsWithoutSpace = Array.from(cells.entries()).filter(
        ([, cell]) => cell.players.length > CELL_MAX_PLAYERS,
    );

    return (
        <For each={cellsWithoutSpace}>
            {([key, cell]) => (
                <CellPlayers
                    key={key}
                    position={cell.position}
                    players={cell.players}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight}
                />
            )}
        </For>
    );
};

interface CellPlayersProps {
    position: CellPosition;
    players: ActivePlayer[];
    cellWidth: number;
    cellHeight: number;
}

const CellPlayers = ({ position, players, cellWidth, cellHeight }: CellPlayersProps) => {
    const x = cellWidth * position.col + cellWidth / 2;
    const y = -(cellHeight * position.row) - cellHeight / 2;

    return (
        <ToggleTip
            lazyMount
            unmountOnExit
            positioning={{ placement: 'top' }}
            content={
                <VStack
                    p={2}
                    gap={4}
                    align="stretch"
                    overflowY="scroll"
                    scrollbarColor="black transparent"
                >
                    <For each={players}>
                        {player => (
                            <HStack key={player.id} gap={4}>
                                <Box position="relative">
                                    <PlayerAvatar
                                        avatarUrl={player.avatar}
                                        color={player.color}
                                        isStreamLive={player.is_stream_live}
                                        showStreamLive
                                        size="xs"
                                        outlineWidth="0.20vw"
                                    />
                                </Box>
                                <Text>{player.name}</Text>
                            </HStack>
                        )}
                    </For>
                </VStack>
            }
        >
            <IconButton
                zIndex={14}
                size="xl"
                position="absolute"
                positionAnchor="--cells-players"
                top="anchor(end)"
                transform={`translate(calc(${x}px - 50%), calc(${y}px + 50%))`}
            >
                {players.length}
            </IconButton>
        </ToggleTip>
    );
};
