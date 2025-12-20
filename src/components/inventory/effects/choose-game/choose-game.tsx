import { ChooseGameSelect } from './ChooseGameSelect';
import type { Key } from 'react';

export const createChooseGame = (key?: Key) => {
    return <ChooseGameSelect key={key} />;
};
