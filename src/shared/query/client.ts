import { QueryClient } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';
import { queryKeys } from './keys';

export const queryClient = new QueryClient();

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
