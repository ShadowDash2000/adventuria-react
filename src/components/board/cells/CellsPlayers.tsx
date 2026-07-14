import { useBoardInnerContext } from '@components/board';
import { For, HStack, IconButton, VStack, Text, Box } from '@chakra-ui/react';
import { ToggleTip } from '@ui/toggle-tip';
import type { PlayerRecord } from '@shared/types/player';
import { PlayerAvatar } from '../../PlayerAvatar';
import { CELL_MAX_PLAYERS } from '../Board';

export const CellsPlayers = () => {
    const { playersByCellIndex } = useBoardInnerContext();

    const cellsWithoutSpace = new Map<number, PlayerRecord[]>();
    for (const [cellIndex, players] of playersByCellIndex) {
        if (players.length <= CELL_MAX_PLAYERS) continue;
        cellsWithoutSpace.set(cellIndex, players);
    }

    return (
        <For each={[...cellsWithoutSpace.entries()]}>
            {([cellIndex, players]) => (
                <CellPlayers key={cellIndex} cellIndex={cellIndex} players={players} />
            )}
        </For>
    );
};

interface CellTooltipProps {
    cellIndex: number;
    players: PlayerRecord[];
}

const CellPlayers = ({ cellIndex, players }: CellTooltipProps) => {
    const { cellWidth, cellHeight, topology, defaultWorldSlug } = useBoardInnerContext();
    const position = topology.positionByCellIndex.get(cellIndex);
    if (!position || (defaultWorldSlug && position.worldId !== defaultWorldSlug)) return null;

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
                                        player={player}
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
                zIndex={20}
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
