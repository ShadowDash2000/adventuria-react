import { QueryClient } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ActionRecord } from '@shared/types/action';
import type PocketBase from 'pocketbase';
import type { RecordListOptions } from 'pocketbase';

export const queryClient = new QueryClient();

export const queryKeys = {
    user: ['user'],
    users: ['users'],
    actions: ['actions'],
    latestAction: ['latest-action'],
    availableActions: ['available-actions'],
    radioAudioPreset: ['radio-audio-preset'],
    activities: ['activities'],
    shopItems: ['shop-items'],
    items: ['items'],
    settings: ['settings'],
    rules: ['rules'],
    cells: ['cells'],
    activityWheel: ['activity-wheel'],
    refreshShopView: ['refresh-shop-view'],
    cell: (cellId: RecordIdString) => ['cells', 'cell', cellId],
    inventory: (userId: RecordIdString) => ['inventory', userId],
    item: (itemId: RecordIdString) => ['items', itemId],
} as const;

export const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.user });
};

export const invalidateUsers = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.users });
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

export const invalidateInventory = async (userId: RecordIdString) => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.inventory(userId) });
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
    userId: RecordIdString,
    options?: RecordListOptions,
) => {
    return {
        queryFn: () =>
            pb
                .collection('actions')
                .getFirstListItem<ActionRecord>(`user = "${userId}"`, {
                    sort: '-created',
                    ...options,
                }),
        refetchOnWindowFocus: false,
        queryKey: queryKeys.latestAction,
    };
};
