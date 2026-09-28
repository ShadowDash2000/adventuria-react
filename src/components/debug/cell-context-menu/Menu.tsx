import { For, Menu, Portal } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { useCellContextMenuStore } from '@components/debug/cell-context-menu/useCellContextMenuStore';
import { handleApiResponse } from '@shared/helpers/api';
import { invalidateAllActions, queryKeys } from '@shared/queryClient';
import { useQuery } from '@tanstack/react-query';
import { pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { and, eq, notEq } from '@shared/pbFilter';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import { LuChevronRight } from 'react-icons/lu';

export const CellContextMenu = () => {
    const { pb, playerId, isAuth, gameState, isGameStateSuccess } = useAppContext();
    const { selectedCellId, anchorElement, isOpen, closeMenu } = useCellContextMenuStore();

    const handleMoveToCellId = async (playerId: string) => {
        const res = await moveToCellIdRequest(pb.authStore.token, playerId, selectedCellId || '');

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
    };

    const playersProgress = useQuery({
        queryFn: () =>
            pb
                .collection(pbCollections.playersProgress)
                .getFullList<PlayerProgressRecord>({
                    filter: and(
                        eq(playerProgressSchema.season, gameState!.season),
                        notEq(playerProgressSchema.player, playerId!),
                    ),
                    expand: playerProgressSchema.player,
                    fields: joinExpand(
                        dotExpand('expand', playerProgressSchema.player, playerSchema.id),
                        dotExpand('expand', playerProgressSchema.player, playerSchema.name),
                    ),
                }),
        queryKey: [...queryKeys.playersProgress, 'cell-context-menu', gameState?.season, playerId],
        enabled: isAuth && isGameStateSuccess,
    });

    if (!isAuth || !gameState?.debug) {
        return null;
    }

    return (
        <Menu.Root
            open={isOpen}
            onOpenChange={e => !e.open && closeMenu()}
            positioning={{ getAnchorElement: () => anchorElement }}
            lazyMount
            unmountOnExit
        >
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item
                            value="move-to-cell-id"
                            onClick={async () => {
                                try {
                                    await handleMoveToCellId(playerId);
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                        >
                            Переместиться на клетку
                        </Menu.Item>
                        <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
                            <Menu.TriggerItem>
                                Переместить игрока на клетку <LuChevronRight />
                            </Menu.TriggerItem>
                            <Menu.Positioner>
                                <Menu.Content>
                                    {playersProgress.isSuccess && (
                                        <For each={playersProgress.data}>
                                            {playerProgress => (
                                                <Menu.Item
                                                    key={playerProgress.expand!.player.id}
                                                    value={playerProgress.expand!.player.id}
                                                    onClick={async () => {
                                                        try {
                                                            await handleMoveToCellId(
                                                                playerProgress.expand!.player.id,
                                                            );
                                                        } catch (e) {
                                                            console.error(e);
                                                        }
                                                    }}
                                                >
                                                    {playerProgress.expand!.player.name}
                                                </Menu.Item>
                                            )}
                                        </For>
                                    )}
                                </Menu.Content>
                            </Menu.Positioner>
                        </Menu.Root>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

type MoveToCellIdSuccess = { success: true; message?: string; error?: never };

type MoveToCellIdError = { success: false; message: string; error: string };

type MoveToCellIdResult = MoveToCellIdSuccess | MoveToCellIdError;

const moveToCellIdRequest = async (authToken: string, playerId: string, cellId: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/debug/move-to-cell-id`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, cell_id: cellId }),
    });

    return (await res.json()) as MoveToCellIdResult;
};
