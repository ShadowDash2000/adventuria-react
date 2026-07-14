import { toaster } from '@ui/toaster';

export type ApiResponse = { success: boolean; message?: string; error?: string };

export function handleApiResponse<T extends ApiResponse>(
    res: T,
    errorTitle: string = 'Ошибка',
): res is T & { success: true } {
    if (!res.success) {
        toaster.create({
            type: 'error',
            title: errorTitle,
            description: res.message || res.error || 'Произошла ошибка при выполнении запроса',
        });
        return false;
    }
    return true;
}
