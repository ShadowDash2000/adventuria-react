import { type RefObject, useEffect, useState } from 'react';

type BoardDimensions = { width: number; height: number };

export const useBoardDimensions = (boardRef: RefObject<HTMLElement | null>): BoardDimensions => {
    const [dimensions, setDimensions] = useState<BoardDimensions>({ width: 0, height: 0 });

    useEffect(() => {
        const board = boardRef.current;
        if (!board) return;

        const measure = () => {
            const rect = board.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
        };

        measure();

        const observer = new ResizeObserver(measure);
        observer.observe(board);

        return () => observer.disconnect();
    }, [boardRef]);

    return dimensions;
};
