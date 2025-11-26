import type {Key, ReactNode} from "react";
import type {UseFormRegister} from "react-hook-form";
import {EffectController} from "@shared/types/effects/effect-controller";
import {GameTagSelect} from "@shared/types/effects/GameTagSelect";

export class AddGameTag extends EffectController {
    buildInputs(key: Key, register: UseFormRegister<any>): ReactNode {
        return <GameTagSelect
            key={key}
            label="Выберите добавочный тег"
            placeholder="Теги"
            {...register('tag', {required: true})}
        />
    }
}