import { PaidMovementInRadiusSelect } from './PaidMovementInRadiusSelect';
import type { EffectCreatorProps } from '../effect-factory';

export const createPaidMovementInRadius = ({ effectId, key }: EffectCreatorProps) => {
    return <PaidMovementInRadiusSelect key={key} effectId={effectId} />;
};
