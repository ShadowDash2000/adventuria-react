import { type JSX, Key } from 'react';
import { createAddGameTag } from './add-game-tag/add-game-tag';
import { createChooseGame } from '@components/inventory/effects/choose-game/choose-game';

export type Type_Effect_Creator = (key?: Key) => JSX.Element;

export class EffectFactory {
    private static effects: Record<string, Type_Effect_Creator | null> = {
        cellPointsDivide: null,
        addGameTag: createAddGameTag,
        chooseGame: createChooseGame,
    };

    static get(t: string): Type_Effect_Creator | null {
        return this.effects[t] || null;
    }
}
