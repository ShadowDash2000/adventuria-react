import {EffectController} from "@shared/types/effects/effect-controller";
import {AddGameTag} from "@shared/types/effects/add-game-tag";
import {EmptyEffect} from "@shared/types/effects/empty-effect";

export class EffectFactory {
    private static effects: Record<string, EffectController> = {
        'cellPointsDivide': new EmptyEffect(),
        'addGameTag': new AddGameTag(),
    }

    static get(t: string): EffectController {
        return this.effects[t] || new EmptyEffect();
    }
}