import { useEffect, useRef, type CSSProperties } from 'react';
import { type Angle, performRoll, performRotation } from '../roll';

const diceConfig: Record<number, Angle> = {
    1: { x: 0, y: 0 },
    2: { x: 90, y: 0 },
    3: { x: 0, y: -90 },
    4: { x: 0, y: 90 },
    5: { x: -90, y: 0 },
    6: { x: 180, y: 0 },
};

interface D6DiceProps {
    value: number;
    durationSec?: number;
    sizePx?: number;
}

export const D6Dice = ({ value, durationSec, sizePx = 200 }: D6DiceProps) => {
    const rotateRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!rotateRef.current) return;

        const angle = diceConfig[value];

        performRoll(rotateRef.current, durationSec);
        performRotation(rotateRef.current, angle);
    }, [value, durationSec]);

    const sizeStyle: CSSProperties = { width: sizePx, height: sizePx };

    return (
        <div className={`cube rotate`} ref={rotateRef} style={sizeStyle}>
            <div className="face front one" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                </div>
            </div>
            <div className="face back six" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
            <div className="face right three" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
            <div className="face left four" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
            <div className="face top five" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
            <div className="face bottom two" style={sizeStyle}>
                <div className="dot-container">
                    <div className="dot" />
                    <div className="dot" />
                </div>
            </div>
        </div>
    );
};
