import { useEffect, useRef } from 'react';
import { type Angle, performRoll, performRotation } from '../roll';

const diceConfig: Record<number, Angle> = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: 120 },
    3: { x: 0, y: 240 },
    4: { x: 90, y: 180 },
};

interface D4DiceProps {
    value: number;
    durationSec?: number;
}

export const D4Dice = ({ value, durationSec }: D4DiceProps) => {
    const rotateRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!rotateRef.current) return;

        const angle = diceConfig[value];

        performRoll(rotateRef.current, durationSec);
        performRotation(rotateRef.current, angle);
    }, [value, durationSec]);

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
};
