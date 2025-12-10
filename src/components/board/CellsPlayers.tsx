import { type FC, useMemo } from 'react';
import { useBoardInnerContext } from './BoardInner';
import { For, HStack, IconButton, VStack, Text } from '@chakra-ui/react';
import { ToggleTip } from '@ui/toggle-tip';
import { BoardHelper } from './BoardHelper';
import type { UserRecord } from '@shared/types/user';
import { Avatar } from '../Avatar';

export const CellsPlayers: FC = () => {
    const { cells, cellsUsers } = useBoardInnerContext();
    const cellTooltips = useMemo(() => {
        const cellsWithoutSpace = new Map<string, string[]>();
        for (const [cellId, usersIds] of cellsUsers.entries()) {
            if (usersIds.length <= 6) continue;
            cellsWithoutSpace.set(cellId, usersIds);
        }

        const cellPosToUsers = new Map<number, string[]>();
        for (const [cellIndex, cell] of cells.entries()) {
            const users = cellsWithoutSpace.get(cell.id);
            if (users) {
                cellPosToUsers.set(cellIndex, users);
            }
        }
        return cellPosToUsers;
    }, [cellsUsers]);

    return (
        <For each={[...cellTooltips.entries()]}>
            {([cellIndex, usersIds]) => (
                <CellPlayers key={cellIndex} cellIndex={cellIndex} usersIds={usersIds} />
            )}
        </For>
    );
};

interface CellTooltipProps {
    cellIndex: number;
    usersIds: string[];
}

const CellPlayers: FC<CellTooltipProps> = ({ cellIndex, usersIds }) => {
    const { rows, cols, cellWidth, cellHeight, users } = useBoardInnerContext();
    const position = useMemo(
        () => BoardHelper.getCoords(rows, cols, cellIndex),
        [rows, cols, cellIndex],
    );
    const usersFiltered = useMemo<UserRecord[]>(
        () => usersIds.map(userId => users.get(userId)!),
        [usersIds, users],
    );

    const x = cellWidth * position.col + cellWidth / 2;
    const y = -(cellHeight * position.row) - cellHeight / 2;

    return (
        <ToggleTip
            lazyMount
            unmountOnExit
            positioning={{ placement: 'top' }}
            content={
                <VStack p={2} gap={4} align="stretch">
                    <For each={usersFiltered}>
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
                {usersIds.length}
            </IconButton>
        </ToggleTip>
    );
};
