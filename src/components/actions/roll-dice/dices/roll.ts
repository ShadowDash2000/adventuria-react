import { rolls, type DiceType, type RollResult } from './types';

export function performRoll(
    element: HTMLDivElement,
    type: DiceType,
    value: number,
    durationSec: number = 4,
): RollResult {
    const roll = rolls[type].find(c => c.value === value)!;

    const randomX = Math.floor(Math.random() * 4 + 4) * 360;
    const randomY = Math.floor(Math.random() * 4 + 4) * 360;

    const x = randomX + roll.x;
    const y = randomY + roll.y;

    element.style.transition = `transform ${durationSec}s ease-in-out`;
    requestAnimationFrame(() => {
        performRotation(element, { x: x, y: y });
    });

    return { x: x, y: y, roll: roll.value };
}

export type Angle = { x: number; y: number };

export function performRotation(element: HTMLDivElement, angle: Angle) {
    element.style.transform = `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`;
}

export function performFadeOut(element: HTMLDivElement, durationSec: number = 1) {
    element.style.transition = `opacity ${durationSec}s ease-in-out`;
    element.style.opacity = '0';
}
