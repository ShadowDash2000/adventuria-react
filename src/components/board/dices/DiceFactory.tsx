import {createRef, type Key, type CSSProperties} from 'react';
import Dice from './Dice';
import type {DiceRef, DiceType, DiceFactoryItem} from './types';

type CreateDiceOptions = {
    sizePx?: number;
    className?: string;
    style?: CSSProperties;
    key?: Key;
};

export const DiceFactory = {
    create(type: DiceType, options: CreateDiceOptions = {}): DiceFactoryItem {
        const ref = createRef<DiceRef>();
        const {sizePx, className, style, key} = options;
        const element = (
            <Dice key={key} ref={ref} type={type} sizePx={sizePx} className={className} style={style}/>
        );
        return {element, ref};
    },
}

export default DiceFactory;
