import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

export const queryKeys = {
    user: ['user'],
    actions: ['actions'],
    availableActions: ['available-actions'],
} as const;

export const invalidateUser = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.user });
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
