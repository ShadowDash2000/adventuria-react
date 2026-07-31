import { ChooseActivitySelect } from './ChooseActivitySelect';
import type { EffectCreatorProps } from '../effect-factory';

export const createChooseActivity = ({ effectId, key }: EffectCreatorProps) => {
    return <ChooseActivitySelect key={key} effectId={effectId} />;
};
