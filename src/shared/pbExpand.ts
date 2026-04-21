export const joinExpand = (...parts: Array<string>) => parts.filter(Boolean).join(',');

export const dotExpand = (...parts: string[]) => parts.join('.');
