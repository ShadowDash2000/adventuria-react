export const eq = (field: string, value: string | number | boolean) =>
    `${field} = ${typeof value === 'string' ? `"${value}"` : value}`;

export const and = (...parts: string[]) => parts.join(' && ');

export const or = (...parts: string[]) => parts.join(' || ');
