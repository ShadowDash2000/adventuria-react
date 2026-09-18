import { type ReactNode, useRef, useState } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { PlayerProgressRecord } from '@shared/types/player_progress';
import { Box, For, Menu } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { handleApiResponse } from '@shared/helpers/api';
import { invalidateAllActions, queryKeys } from '@shared/queryClient';
import { useQuery } from '@tanstack/react-query';
import { pbCollections, playerProgressSchema, playerSchema } from '@shared/pbSchema';
import { and, eq, notEq } from '@shared/pbFilter';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import { LuChevronRight } from 'react-icons/lu';

interface ItemContextMenuProps {
    children: ReactNode;
    itemId: RecordIdString;
}

export const ItemContextMenu = ({ children, itemId }: ItemContextMenuProps) => {
    const { pb, playerId, isAuth, gameState, isGameStateSuccess } = useAppContext();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handleAddItemById = async (playerId: string) => {
        const res = await addItemByIdRequest(pb.authStore.token, playerId, itemId);

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
        queryKey: [...queryKeys.playersProgress, 'item-context-menu', gameState?.season, playerId],
        enabled: isAuth && isGameStateSuccess,
    });

    if (!isAuth || !gameState?.debug) {
        return children;
    }

    return (
        <Menu.Root
            open={open}
            onOpenChange={({ open }) => setOpen(open)}
            positioning={{
                getAnchorElement: () => anchorRef.current,
                strategy: 'fixed',
                hideWhenDetached: true,
                placement: 'right',
            }}
            lazyMount
            unmountOnExit
        >
            <Box
                ref={anchorRef}
                onContextMenu={e => {
                    e.preventDefault();
                    setOpen(true);
                }}
            >
                {children}
            </Box>
            <Menu.Positioner>
                <Menu.Content>
                    <Menu.Item
                        value="add-item-by-id"
                        onClick={async () => {
                            try {
                                await handleAddItemById(playerId);
                            } catch (e) {
                                console.error(e);
                            }
                        }}
                    >
                        Добавить в инвентарь
                    </Menu.Item>
                    <Menu.Root positioning={{ placement: 'right-start', gutter: 2 }}>
                        <Menu.TriggerItem>
                            Добавить в инвентарь игроку <LuChevronRight />
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
                                                        await handleAddItemById(
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
        </Menu.Root>
    );
};

type AddItemByIdSuccess = { success: true; message?: string; error?: never };

type AddItemByIdError = { success: false; message: string; error: string };

type AddItemByIdResult = AddItemByIdSuccess | AddItemByIdError;

const addItemByIdRequest = async (authToken: string, playerId: string, itemId: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/debug/add-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ player_id: playerId, item_id: itemId }),
    });

    return (await res.json()) as AddItemByIdResult;
};
