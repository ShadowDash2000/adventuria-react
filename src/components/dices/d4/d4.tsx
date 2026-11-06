import type { ReactNode } from 'react';
import { DiceDispenser } from '../dice-base';
import { D4Dice } from './Dice';

export class D4 extends DiceDispenser {
    sides = 4;

    node(value: number, durationSec?: number): ReactNode {
        return <D4Dice value={value} durationSec={durationSec} />;
    }

    key(): string {
        return 'd4';
    }
}
