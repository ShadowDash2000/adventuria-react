import { type JSX, Key } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { createAddGameGenre } from './add-game-genre/add-game-genre';
import { createChooseGame } from './choose-game/choose-game';
import { createPaidMovementInRadius } from './paid-movement-in-radius/paid-movement-in-radius';

export interface EffectCreatorProps {
    key?: Key;
    invItemId: RecordIdString;
    effectId: RecordIdString;
}

export type Type_Effect_Creator = (props: EffectCreatorProps) => JSX.Element;

export class EffectFactory {
    private static effects: Record<string, Type_Effect_Creator | null> = {
        add_game_genre: createAddGameGenre,
        choose_activity: createChooseGame,
        paid_movement_in_radius: createPaidMovementInRadius,
    };

    static get(t: string): Type_Effect_Creator | null {
        return this.effects[t] || null;
    }
}
