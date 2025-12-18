import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const queryKeys = {
    user: ['user'],
    actions: ['actions'],
    latestAction: ['latest-action'],
    availableActions: ['available-actions'],
    radioAudioPreset: ['radio-audio-preset'],
} as const;

export const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.user });
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
    await Promise.all([invalidateActions(), invalidateAvailableActions()]);
};

export const invalidateRadioAudioPreset = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.radioAudioPreset });
};
