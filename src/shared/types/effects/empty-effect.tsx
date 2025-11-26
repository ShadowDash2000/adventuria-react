import type {Key, ReactNode} from "react";
import type {UseFormRegister} from "react-hook-form";
import {EffectController} from "@shared/types/effects/effect-controller";

export class EmptyEffect extends EffectController {
    buildInputs(_key: Key, _register: UseFormRegister<any>): ReactNode {
        return null
    }
}