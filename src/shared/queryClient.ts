import { QueryClient } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ActionRecord } from '@shared/types/action';
import type PocketBase from 'pocketbase';
import type { RecordListOptions } from 'pocketbase';
import { actionSchema, pbCollections } from '@shared/pbSchema';

export const queryClient = new QueryClient();

export const queryKeys = {
    playerAuth: ['player-auth'],
    player: (playerId: RecordIdString) => ['players', playerId],
    players: ['players'],
    playerProgressAuth: ['player-progress-auth'],
    playerProgress: (playerId: RecordIdString) => ['player-progress', playerId],
    playersProgress: ['players-progress'],
    actions: ['actions'],
    latestAction: ['latest-action'],
    availableActions: ['available-actions'],
    radioAudioPreset: ['radio-audio-preset'],
    activities: ['activities'],
    shopItems: ['shop-items'],
    completeActivityView: ['complete-activity-view'],
    items: ['items'],
    settings: ['settings'],
    rules: ['rules'],
    cells: ['cells'],
    worlds: ['worlds'],
    activityWheel: ['activity-wheel'],
    itemsWheel: ['items-wheel'],
    refreshShopView: ['refresh-shop-view'],
    cell: (cellId: RecordIdString) => ['cells', 'cell', cellId],
    inventory: (playerId: RecordIdString) => ['inventory', playerId],
    item: (itemId: RecordIdString) => ['items', itemId],
} as const;

export const invalidatePlayerAuth = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.playerAuth });
};

export const invalidatePlayer = async (playerId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.player(playerId) });
};

export const invalidatePlayers = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.players });
};

export const invalidatePlayerProgressAuth = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.playerProgressAuth });
};

export const invalidatePlayerProgress = async (playerId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.playerProgress(playerId) });
};

export const invalidatePlayersProgress = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.playersProgress });
};

export const invalidateActions = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.actions });
};

export const invalidateLatestAction = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.latestAction });
};

export const invalidateAvailableActions = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.availableActions });
};

export const invalidateAllActions = async () => {
    await Promise.all([
        invalidateActions(),
        invalidateAvailableActions(),
        invalidateLatestAction(),
    ]);
};

export const invalidateRadioAudioPreset = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.radioAudioPreset });
};

export const invalidateActivities = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.activities });
};

export const invalidateShopItems = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.shopItems });
};

export const invalidateItems = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.items });
};

export const invalidateSettings = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.settings });
};

export const invalidateRules = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.rules });
};

export const invalidateInventory = async (playerId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.inventory(playerId) });
};

export const invalidateCells = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cells });
};

export const invalidateCell = async (cellId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cell(cellId) });
};

export const invalidateItem = async (itemId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.item(itemId) });
};

export const invalidateRefreshShopView = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.refreshShopView });
};

export const latestActionQuery = (
    pb: PocketBase,
    playerId: RecordIdString,
    options?: RecordListOptions,
) => {
    return {
        queryFn: () =>
            pb
                .collection(pbCollections.actions)
                .getFirstListItem<ActionRecord>(`${actionSchema.player} = "${playerId}"`, {
                    sort: '-created',
                    ...options,
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.latestAction,
    };
};
