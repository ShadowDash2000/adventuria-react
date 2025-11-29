import {FC, useEffect, useState} from "react";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {type PlayerMoveEvent, useBoardContext} from "./Board";
import {BoardHelper} from "./BoardHelper";
import {Avatar} from "../Avatar";

interface PlayerProps {
    user: UserRecord;
}

type PlayerPosition = {
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
}

const moveTime = 1;

export const Player: FC<PlayerProps> = (
    {
        user
    }
) => {
    const {isAuth} = useAppContext();
    const {
        rows,
        cols,
        cellWidth,
        cellHeight,
    } = useBoardContext();
    const [position, setPosition] = useState<PlayerPosition>({offsetX: 0, offsetY: 0, x: 0, y: 0});

    const move = (row: number, col: number) => {
        const x = cellWidth * col;
        const y = -(cellHeight * row) - cellHeight;
        const offsetX = 50;
        const offsetY = 130;

        setPosition({x, y, offsetX, offsetY});
    }

    useEffect(() => {
        const pos = BoardHelper.getCoords(rows, cols, user.cellsPassed);
        move(pos.row, pos.col);

        if (!isAuth) return;

        const abortController = new AbortController();

        const stepsQueue: Array<{ row: number; col: number }> = [];
        let intervalId: number | null = null;
        document.addEventListener(`player.move.${user.id}`, (e) => {
            const {detail} = e as CustomEvent<PlayerMoveEvent>;

            if (stepsQueue.length > 0) {
                stepsQueue.push(BoardHelper.getCoords(rows, cols, detail.cellsPassed));
            } else {
                stepsQueue.push(...BoardHelper.createPath(rows, cols, detail.prevCellsPassed, detail.cellsPassed));
            }

            if (intervalId) return;

            intervalId = setInterval(moveInterval, moveTime * 1000);
        }, {signal: abortController.signal});

        const moveInterval = () => {
            const next = stepsQueue.shift();

            if (!next) {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
                return;
            }

            move(next.row, next.col);
        }

        return () => abortController.abort();
    }, [rows, cols, cellWidth, cellHeight, isAuth]);

    return (
        <Avatar
            user={user}
            position="absolute"
            zIndex={10}
            transform={`translate(calc(${position.x}px + ${position.offsetX}%), calc(${position.y}px + ${position.offsetY}%))`}
            transition={`transform ${moveTime}s ease`}
        />
    )
}