import { ChooseGameSelect } from './ChooseGameSelect';
import type { EffectCreatorProps } from '../effect-factory';

export const createChooseGame = ({ key }: EffectCreatorProps) => {
    return <ChooseGameSelect key={key} />;
};
