import { GameGenreSelect } from './GameGenreSelect';
import type { EffectCreatorProps } from '../effect-factory';

export const createAddGameGenre = ({ key }: EffectCreatorProps) => {
    return <GameGenreSelect key={key} />;
};
