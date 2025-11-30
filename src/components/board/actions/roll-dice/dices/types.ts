import type {RefObject, ReactElement} from 'react';

export type DiceType = 'd4' | 'd6';

export type DiceRef = {
    roll: (value: number, durationSec: number) => void;
};

export type DiceFactoryItem = {
    element: ReactElement;
    ref: RefObject<DiceRef | null>;
};

export type RollConfig = { x: number; y: number; value: number };

export type RollResult = { roll: number; x: number; y: number };

export const rolls: Record<DiceType, RollConfig[]> = {
    d4: [
        {x: 0, y: 0, value: 1},
        {x: 0, y: 120, value: 2},
        {x: 0, y: 240, value: 3},
        {x: 90, y: 180, value: 4},
    ],
    d6: [
        {x: 0, y: 0, value: 1},
        {x: 90, y: 0, value: 2},
        {x: 0, y: -90, value: 3},
        {x: 0, y: 90, value: 4},
        {x: -90, y: 0, value: 5},
        {x: 180, y: 0, value: 6},
    ],
};
