import type { IsoDateString } from '@shared/types/pocketbase';

export const formatDateLocalized = (
    isoString: IsoDateString,
    options?: Intl.DateTimeFormatOptions,
) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        ...options,
    })
        .format(new Date(isoString))
        .replace(',', ' ');
};

export function resolveRelativeImageUrlsFromHtml(html: string, baseUrl: string): string {
    const document = new DOMParser().parseFromString(html, 'text/html');

    document.querySelectorAll<HTMLImageElement>('img[src]').forEach(image => {
        const src = image.getAttribute('src');

        if (src?.startsWith('/_/../api/files') || src?.startsWith('/api/files')) {
            image.src = new URL(src, baseUrl).toString();
        }
    });

    return document.body.innerHTML;
}

export function formatSecondsToString(timeSeconds: number) {
    const hours = String(Math.floor(timeSeconds / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timeSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(timeSeconds % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}
