import type { ReactNode } from 'react';

export abstract class DiceDispenser {
    abstract node(value: number, durationSec?: number): ReactNode;

    abstract key(): string;
}
