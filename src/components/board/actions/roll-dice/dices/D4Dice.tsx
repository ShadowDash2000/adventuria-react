import {forwardRef, useImperativeHandle, useRef} from 'react';
import {type DiceRef} from './types';
import {performRoll} from './roll';

type D4DiceProps = {
    sizePx?: number
}

export const D4Dice = forwardRef<DiceRef, D4DiceProps>(
    (_props, ref) => {
        const rotateRef = useRef<HTMLDivElement | null>(null);

        useImperativeHandle(ref, () => ({
            roll: (value: number, durationSec: number = 4) => {
                const el = rotateRef.current;
                if (el) performRoll(el, 'd4', value, durationSec);
            }
        }), []);

        return (
            <div className="d4-container">
                <div className="polygon3d rotate" ref={rotateRef}>
                    <div className="triangle front">
                        <div className="blue"/>
                        <div className="dot-container">
                            <div className="dot"/>
                        </div>
                    </div>
                    <div className="triangle back-left">
                        <div className="green"/>
                        <div className="dot-container">
                            <div className="dot"/>
                            <div className="dot"/>
                        </div>
                    </div>
                    <div className="triangle back-right">
                        <div className="yellow"/>
                        <div className="dot-container">
                            <div className="dot"/>
                            <div className="dot"/>
                            <div className="dot"/>
                        </div>
                    </div>
                    <div className="triangle bottom">
                        <div className="red"/>
                        <div className="dot-container">
                            <div className="dot"/>
                            <div className="dot"/>
                            <div className="dot"/>
                            <div className="dot"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);