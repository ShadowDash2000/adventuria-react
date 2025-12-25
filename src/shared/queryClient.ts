import { QueryClient } from '@tanstack/react-query';
import type { RecordIdString } from '@shared/types/pocketbase';

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
    inventory: (userId: RecordIdString) => ['inventory', userId],
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
