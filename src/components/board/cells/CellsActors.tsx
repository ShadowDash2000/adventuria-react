import type { CellPosition } from '@components/board/BoardHelper';
import type { ActiveActor } from '@shared/query/requests';
import { useActorsStore } from '@components/board/actors/useActorsStore';
import { For, HStack, IconButton, VStack, Text, Box } from '@chakra-ui/react';
import { ToggleTip } from '@ui/toggle-tip';
import { PlayerAvatar } from '../../PlayerAvatar';
import { CELL_MAX_PLAYERS } from '../Board';

interface CellsPlayersProps {
    activeActors: ActiveActor[];
    cellWidth: number;
    cellHeight: number;
}

export const CellsActors = ({ activeActors, cellWidth, cellHeight }: CellsPlayersProps) => {
    const actorStates = useActorsStore(state => state.actorStates);
    const actorsById = new Map(activeActors.map(player => [player.id, player]));
    const cells = new Map<string, { position: CellPosition; actors: ActiveActor[] }>();

    const orderedActors = Array.from(actorStates.entries()).sort(
        ([aId, a], [bId, b]) => a.updated - b.updated || aId.localeCompare(bId),
    );

    for (const [actorId, state] of orderedActors) {
        const actor = actorsById.get(actorId);
        if (!actor) continue;

        const { worldId, row, col } = state.cellPosition;
        const key = JSON.stringify([worldId, row, col]);
        const cell = cells.get(key);
        if (cell) {
            cell.actors.push(actor);
        } else {
            cells.set(key, { position: state.cellPosition, actors: [actor] });
        }
    }

    const cellsWithoutSpace = Array.from(cells.entries()).filter(
        ([, cell]) => cell.actors.length > CELL_MAX_PLAYERS,
    );

    return (
        <For each={cellsWithoutSpace}>
            {([key, cell]) => (
                <CellPlayers
                    key={key}
                    position={cell.position}
                    actors={cell.actors}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight}
                />
            )}
        </For>
    );
};

interface CellPlayersProps {
    position: CellPosition;
    actors: ActiveActor[];
    cellWidth: number;
    cellHeight: number;
}

const CellPlayers = ({ position, actors, cellWidth, cellHeight }: CellPlayersProps) => {
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
                    <For each={actors}>
                        {actor => (
                            <HStack key={actor.id} gap={4}>
                                <Box position="relative">
                                    <PlayerAvatar
                                        avatarUrl={actor.avatar}
                                        color={actor.color}
                                        size="xs"
                                        outlineWidth="0.20vw"
                                    />
                                </Box>
                                <Text>{actor.name}</Text>
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
                {actors.length}
            </IconButton>
        </ToggleTip>
    );
};
