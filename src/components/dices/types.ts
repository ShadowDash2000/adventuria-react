import type { DiceDispenser } from './dice-base';
import { D4 } from './d4/d4';
import { D6 } from './d6/d6';

export const dices: Record<string, DiceDispenser> = { d4: new D4(), d6: new D6() };

export type DiceType = keyof typeof dices;
