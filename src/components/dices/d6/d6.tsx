import type { ReactNode } from 'react';
import { DiceDispenser } from '../dice-base';
import { D6Dice } from './Dice';

export class D6 extends DiceDispenser {
    node(value: number, durationSec?: number): ReactNode {
        return <D6Dice value={value} durationSec={durationSec} />;
    }

    key(): string {
        return 'd6';
    }
}
