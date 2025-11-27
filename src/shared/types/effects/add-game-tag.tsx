import type {Key, ReactNode} from "react";
import {EffectController} from "@shared/types/effects/effect-controller";
import {GameTagSelect} from "@shared/types/effects/GameTagSelect";

export class AddGameTag extends EffectController {
    buildInputs(key: Key): ReactNode {
        return <GameTagSelect
            key={key}
            label="Выберите добавочный тег"
            placeholder="Теги"
            name='tag'
            required
        />
    }
}