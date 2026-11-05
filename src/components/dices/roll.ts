export function performRoll(element: HTMLDivElement, durationSec: number = 4) {
    element.style.transition = `transform ${durationSec}s ease-in-out`;
}

export type Angle = { x: number; y: number };

export function performRotation(element: HTMLDivElement, angle: Angle) {
    const randomX = Math.floor(Math.random() * 4 + 4) * 360;
    const randomY = Math.floor(Math.random() * 4 + 4) * 360;

    const x = randomX + angle.x;
    const y = randomY + angle.y;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            element.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
        });
    });
}
