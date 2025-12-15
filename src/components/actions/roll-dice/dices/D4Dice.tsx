import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { type DiceRef, RollResult } from './types';
import { performRoll, performRotation } from './roll';

type D4DiceProps = { sizePx?: number };

export const D4Dice = forwardRef<DiceRef, D4DiceProps>(function D4Dice(_props, ref) {
    const rotateRef = useRef<HTMLDivElement | null>(null);
    const [rollRes, setRollRes] = useState<RollResult | null>(null);

    useImperativeHandle(
        ref,
        () => ({
            roll: (value: number, durationSec: number = 4) => {
                const el = rotateRef.current;
                if (!el) return;
                setRollRes(performRoll(el, 'd4', value, durationSec));
            },
        }),
        [],
    );

    if (rollRes && rotateRef.current) {
        performRotation(rotateRef.current, { x: rollRes.x, y: rollRes.y });
    }

    return (
        <div className="d4-container">
            <div className="polygon3d rotate" ref={rotateRef}>
                <div className="triangle front">
                    <div className="blue" />
                    <div className="dot-container">
                        <div className="dot" />
                    </div>
                </div>
                <div className="triangle back-left">
                    <div className="green" />
                    <div className="dot-container">
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                </div>
                <div className="triangle back-right">
                    <div className="yellow" />
                    <div className="dot-container">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                </div>
                <div className="triangle bottom">
                    <div className="red" />
                    <div className="dot-container">
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                </div>
            </div>
        </div>
    );
});
