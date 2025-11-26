import type {Key, ReactNode} from "react";
import type {UseFormRegister} from "react-hook-form";

export abstract class EffectController {
    abstract buildInputs(key: Key, register: UseFormRegister<any>): ReactNode
}