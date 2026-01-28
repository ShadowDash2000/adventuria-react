import { PaidMovementInRadiusSelect } from './PaidMovementInRadiusSelect';
import type { EffectCreatorProps } from '../effect-factory';

export const createPaidMovementInRadius = ({ invItemId, effectId, key }: EffectCreatorProps) => {
    return <PaidMovementInRadiusSelect key={key} invItemId={invItemId} effectId={effectId} />;
};
