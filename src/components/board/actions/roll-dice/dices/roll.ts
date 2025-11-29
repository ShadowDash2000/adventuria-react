import {rolls, type DiceType} from './types';

export function performRoll(
    element: HTMLDivElement,
    type: DiceType,
    value: number,
    durationSec: number = 4
): number {
    const roll = rolls[type].find(c => c.value === value)!;

    const randomX = (Math.floor(Math.random() * 4 + 4)) * 360;
    const randomY = (Math.floor(Math.random() * 4 + 4)) * 360;

    element.style.transition = `transform ${durationSec}s ease-in-out`;
    element.style.transform = `rotateX(${randomX + roll.x}deg) rotateY(${randomY + roll.y}deg)`;

    return roll.value;
}
