import {forwardRef, type CSSProperties, type ForwardRefExoticComponent, type RefAttributes} from 'react';
import {type DiceRef, type DiceType} from './types';
import {D6Dice} from './D6Dice';
import {D4Dice} from './D4Dice';
import './dice.css';

type DiceProps = {
    type: DiceType;
    sizePx?: number;
    className?: string;
    style?: CSSProperties;
};

const DICE_COMPONENTS: Record<
    DiceType,
    ForwardRefExoticComponent<{ sizePx?: number } & RefAttributes<DiceRef>>
> = {
    d4: D4Dice,
    d6: D6Dice,
};

export const Dice = forwardRef<DiceRef, DiceProps>(function Dice({type, sizePx = 200, className, style}, ref) {
    const Impl = DICE_COMPONENTS[type];
    return (
        <div className={className} style={style}>
            <Impl ref={ref} sizePx={sizePx}/>
        </div>
    );
});

export default Dice;
