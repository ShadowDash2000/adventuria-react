import { useBoardInnerContext } from '../BoardInner';
import { For, HStack, IconButton, VStack, Text } from '@chakra-ui/react';
import { ToggleTip } from '@ui/toggle-tip';
import { BoardHelper } from '../BoardHelper';
import type { UserRecord } from '@shared/types/user';
import { Avatar } from '../../Avatar';
import { CELL_MAX_USERS } from '../Board';

export const CellsPlayers = () => {
    const { usersByCellIndex } = useBoardInnerContext();

    const cellsWithoutSpace = new Map<number, UserRecord[]>();
    for (const [cellIndex, users] of usersByCellIndex) {
        if (users.length <= CELL_MAX_USERS) continue;
        cellsWithoutSpace.set(cellIndex, users);
    }

    return (
        <For each={[...cellsWithoutSpace.entries()]}>
            {([cellIndex, users]) => (
                <CellPlayers key={cellIndex} cellIndex={cellIndex} users={users} />
            )}
        </For>
    );
};

interface CellTooltipProps {
    cellIndex: number;
    users: UserRecord[];
}

const CellPlayers = ({ cellIndex, users }: CellTooltipProps) => {
    const { rows, cols, cellWidth, cellHeight } = useBoardInnerContext();
    const position = BoardHelper.getCoords(rows, cols, cellIndex);

    const x = cellWidth * position.col + cellWidth / 2;
    const y = -(cellHeight * position.row) - cellHeight / 2;

    return (
        <ToggleTip
            lazyMount
            unmountOnExit
            positioning={{ placement: 'top' }}
            content={
                <VStack p={2} gap={4} align="stretch">
                    <For each={users}>
                        {user => (
                            <HStack key={user.id}>
                                <Avatar user={user} size="xs" />
                                <Text>{user.name}</Text>
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
                {users.length}
            </IconButton>
        </ToggleTip>
    );
};
