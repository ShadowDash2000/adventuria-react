import type { ReactNode } from 'react';

export abstract class ActionStatusDispenser {
    abstract color(): string;

    abstract name(): string;

    abstract statusNode(): ReactNode;
}
