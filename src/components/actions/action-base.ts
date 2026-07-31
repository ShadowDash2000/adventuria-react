import type { ReactNode } from 'react';

export abstract class ActionDispenser {
    abstract buttonNode(): ReactNode;

    abstract key(): string;
}
