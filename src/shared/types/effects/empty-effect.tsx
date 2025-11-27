import type {Key, ReactNode} from "react";
import {EffectController} from "@shared/types/effects/effect-controller";

export class EmptyEffect extends EffectController {
    buildInputs(_key: Key): ReactNode {
        return null
    }
}