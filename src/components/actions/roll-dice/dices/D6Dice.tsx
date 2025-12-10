import {forwardRef, useImperativeHandle, useRef, type CSSProperties, useState, useEffect} from 'react';
import {type DiceRef, RollResult} from './types';
import {performRoll, performRotation} from './roll';

type D6DiceProps = {
    sizePx?: number;
}

export const D6Dice = forwardRef<DiceRef, D6DiceProps>(
    ({sizePx = 200}, ref) => {
        const rotateRef = useRef<HTMLDivElement | null>(null);
        const [rollRes, setRollRes] = useState<RollResult | null>(null);

        useImperativeHandle(ref, () => ({
            roll: (value: number, durationSec: number = 4) => {
                const el = rotateRef.current;
                if (!el) return;
                setRollRes(performRoll(el, 'd6', value, durationSec));
            }
        }), []);

        if (rollRes && rotateRef.current) {
            performRotation(rotateRef.current, {x: rollRes.x, y: rollRes.y});
        }

        const sizeStyle: CSSProperties = {width: sizePx, height: sizePx};

        return (
            <div className={`cube rotate`} ref={rotateRef} style={sizeStyle}>
                <div className="face front one" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                    </div>
                </div>
                <div className="face back six" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                    </div>
                </div>
                <div className="face right three" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                    </div>
                </div>
                <div className="face left four" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                    </div>
                </div>
                <div className="face top five" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                        <div className="dot"/>
                    </div>
                </div>
                <div className="face bottom two" style={sizeStyle}>
                    <div className="dot-container">
                        <div className="dot"/>
                        <div className="dot"/>
                    </div>
                </div>
            </div>
        );
    }
);