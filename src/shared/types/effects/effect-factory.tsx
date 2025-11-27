import {createAddGameTag} from "@shared/types/effects/add-game-tag";
import {type JSX, Key} from "react";

export type Type_Effect_Creator = (key?: Key) => JSX.Element;

export class EffectFactory {
    private static effects: Record<string, Type_Effect_Creator | null> = {
        'cellPointsDivide': null,
        'addGameTag': createAddGameTag,
    }

    static get(t: string): Type_Effect_Creator | null {
        return this.effects[t] || null;
    }
}