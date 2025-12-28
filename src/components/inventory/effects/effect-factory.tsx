import { type JSX, Key } from 'react';
import { createAddGameGenre } from '@components/inventory/effects/add-game-genre/add-game-genre';
import { createChooseGame } from '@components/inventory/effects/choose-game/choose-game';

export type Type_Effect_Creator = (key?: Key) => JSX.Element;

export class EffectFactory {
    private static effects: Record<string, Type_Effect_Creator | null> = {
        cellPointsDivide: null,
        addGameGenre: createAddGameGenre,
        chooseGame: createChooseGame,
    };

    static get(t: string): Type_Effect_Creator | null {
        return this.effects[t] || null;
    }
}
