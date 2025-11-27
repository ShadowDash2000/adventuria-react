import type {Key, ReactNode} from "react";

export abstract class EffectController {
    abstract buildInputs(key: Key): ReactNode
}