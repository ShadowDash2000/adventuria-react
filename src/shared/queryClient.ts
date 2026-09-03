import { QueryClient } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ActionRecord } from '@shared/types/action';
import type PocketBase from 'pocketbase';
import type { RecordListOptions } from 'pocketbase';
import { actionSchema, pbCollections } from '@shared/pbSchema';

export const queryClient = new QueryClient();

export const queryKeys = {
    gameState: ['game-state'],
    players: ['players'],
    playerProgress: (playerId: RecordIdString) => ['player-progress', playerId],
    playersProgress: ['players-progress'],
    playerStats: ['player-stats'],
    actions: ['actions'],
    availableActions: ['available-actions'],
    radioAudioPreset: ['radio-audio-preset'],
    shopView: ['shop-view'],
    coinsForItemView: ['coins-for-item-view'],
    completeActivityView: ['complete-activity-view'],
    items: ['items'],
    rules: ['rules'],
    cells: ['cells'],
    worlds: ['worlds'],
    activityWheel: ['activity-wheel'],
    itemsWheel: ['items-wheel'],
    refreshShopView: ['refresh-shop-view'],
    seasons: ['seasons'],
    isEventEnded: ['is-event-ended'],
    cell: (cellId: RecordIdString) => ['cells', 'cell', cellId],
    inventory: (playerId: RecordIdString) => ['inventory', playerId],
    item: (itemId: RecordIdString) => ['items', itemId],
    latestCompletedActivities: (cellId: RecordIdString) => ['latest-completed-activities', cellId],
    playerEvents: (actionId: RecordIdString) => ['player-events', actionId],
} as const;

export const invalidateGameState = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.gameState });
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

export const invalidateAvailableActions = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.availableActions });
};

export const invalidateAllActions = async () => {
    await Promise.all([invalidateActions(), invalidateAvailableActions()]);
};

export const invalidateShopView = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.shopView });
};

export const invalidateInventory = async (playerId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.inventory(playerId) });
};

export const invalidateCells = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.cells });
};

export const invalidateRefreshShopView = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.refreshShopView });
};
