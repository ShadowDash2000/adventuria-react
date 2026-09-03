import { Menu, Portal } from '@chakra-ui/react';
import { useAppAuthContext } from '@context/AppContext';
import { useCellContextMenuStore } from '@components/debug/cell-context-menu/useCellContextMenuStore';
import { handleApiResponse } from '@shared/helpers/api';
import { invalidateAllActions } from '@shared/queryClient';

export const CellContextMenu = () => {
    const { pb, gameState } = useAppAuthContext();
    const { selectedCellId, anchorElement, isOpen, closeMenu } = useCellContextMenuStore();

    const handleMoveToCellId = async () => {
        const res = await moveToCellIdRequest(pb.authStore.token, selectedCellId || '');

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
    };

    if (!gameState?.debug) {
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
                                    await handleMoveToCellId();
                                } catch (e) {
                                    console.error(e);
                                }
                            }}
                        >
                            Переместиться на клетку
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

type MoveToCellIdSuccess = { success: true; message?: string; error?: never };

type MoveToCellIdError = { success: false; message: string; error: string };

type MoveToCellIdResult = MoveToCellIdSuccess | MoveToCellIdError;

const moveToCellIdRequest = async (authToken: string, cellId: string) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/debug/move-to-cell-id`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ cell_id: cellId }),
    });

    return (await res.json()) as MoveToCellIdResult;
};
