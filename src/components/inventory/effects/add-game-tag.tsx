import { GameTagSelect } from './GameTagSelect';
import type { Key } from 'react';

export const createAddGameTag = (key?: Key) => {
    return (
        <GameTagSelect
            key={key}
            label="Выберите добавочный тег"
            placeholder="Теги"
            name="tag_id"
            required
        />
    );
};
