import { GameGenreSelect } from './GameGenreSelect';
import type { Key } from 'react';

export const createAddGameGenre = (key?: Key) => {
    return <GameGenreSelect key={key} />;
};
