import type { ReactNode } from 'react';

export abstract class DiceDispenser {
    abstract readonly sides: number;

    roll(): number {
        return Math.floor(Math.random() * this.sides) + 1;
    }

    abstract node(value: number, durationSec?: number): ReactNode;

    abstract key(): string;
}
