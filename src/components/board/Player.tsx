import {FC, useEffect, useMemo, useState} from "react";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Avatar as ChakraAvatar} from "@chakra-ui/react/avatar";
import {type PlayerMoveEvent, useBoardContext} from "./Board";
import {BoardHelper} from "./BoardHelper";

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
    const {pb, isAuth} = useAppContext();
    const {
        rows,
        cols,
        cellWidth,
        cellHeight,
    } = useBoardContext();
    const avatar = useMemo(() => pb.files.getURL(user, user.avatar), [user.avatar]);
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

        document.addEventListener(`player.move.${user.id}`, (e) => {
            const {detail} = e as CustomEvent<PlayerMoveEvent>;
            const path = BoardHelper.createPath(rows, cols, detail.prevCellsPassed, detail.cellsPassed);
            let i = 0;
            const interval = setInterval(() => {
                if (i === path.length) {
                    clearInterval(interval);
                    return;
                }

                move(path[i].row, path[i].col);
                i++;
            }, moveTime * 1000);
        }, {signal: abortController.signal});

        return () => abortController.abort();
    }, [rows, cols, cellWidth, cellHeight, isAuth]);

    return (
        <ChakraAvatar.Root
            position="absolute"
            zIndex={10}
            outlineWidth="{spacing.1}"
            outlineColor={user.color}
            outlineOffset="{spacing.0.5}"
            outlineStyle="solid"
            transform={`translate(calc(${position.x}px + ${position.offsetX}%), calc(${position.y}px + ${position.offsetY}%))`}
            transition={`transform ${moveTime}s ease`}
        >
            <ChakraAvatar.Image src={avatar}/>
        </ChakraAvatar.Root>
    )
}