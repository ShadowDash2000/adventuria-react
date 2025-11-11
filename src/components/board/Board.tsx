import {Button, Flex, Image, VisuallyHidden} from "@chakra-ui/react";
import {createContext, useContext, useRef, useState} from "react";
import {LuArrowBigDown, LuArrowBigUp} from "react-icons/lu";
import {Players} from "./Players";
import type {CellRecord} from "@shared/types/cell";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {useQuery} from "@tanstack/react-query";
import {Cells} from "./Cells";

type BoardContextType = {
    cells: CellRecord[][]
    users: UserRecord[]
}

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const Board = () => {
    const {pb} = useAppContext();
    const [cells, setCells] = useState<CellRecord[][]>([]);
    const [users, setUsers] = useState<UserRecord[]>([]);
    const boardRef = useRef<HTMLDivElement>(null);
    const boardBottomRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        boardRef.current?.scrollIntoView();
    };
    const scrollToBottom = () => {
        boardBottomRef.current?.scrollIntoView();
    };

    useQuery({
        queryKey: ['board'],
        queryFn: async () => {
            const cells = await pb.collection('cells').getFullList<CellRecord>({
                sort: 'sort',
            });
            setCells(buildCells(cells));
            const users = await pb.collection('users').getFullList<UserRecord>();
            setUsers(users);

            return {cells, users};
        },
        refetchOnWindowFocus: false,
    });

    return (
        <Flex
            ref={boardRef}
            id="board"
            justify="center"
            align="flex-end"
            maxWidth="80vw"
            position="relative"
            overflow="hidden"
        >
            <Button
                onClick={scrollToBottom}
                position="absolute"
                zIndex={2}
                top="0"
                rounded="full"
            >
                <LuArrowBigDown/>
            </Button>
            <Button
                onClick={scrollToTop}
                position="absolute"
                zIndex={2}
                bottom="0"
                rounded="full"
            >
                <LuArrowBigUp/>
            </Button>
            <Image
                src="/src/assets/building.png"
                rounded="3rem"
                width="100%"
                zIndex={1}
                pointerEvents="none"
                userSelect="none"
            />
            <Image
                src="/src/assets/walls.png"
                position="absolute"
                width="80vw"
                zIndex={1}
                pointerEvents="none"
                userSelect="none"
            />
            <Flex
                justify="flex-end"
                direction="column"
                position="absolute"
                ml="1.1%"
                mb="4.6%"
                gap=".6vw"
            >
                <BoardContext.Provider value={{cells, users}}>
                    <Cells/>
                    <Players/>
                </BoardContext.Provider>
            </Flex>
            <VisuallyHidden ref={boardBottomRef}/>
        </Flex>
    )
}

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

/**
 * Method expects that cells are already sorted
 * from the smallest to the largest
 */
const buildCells = (cells: CellRecord[], lineSize = 7) => {
    const lineElements = Math.min(cells.length, lineSize);
    const result = [];
    let line = 0;
    let currentLine = [];
    let elementIndex = 1;

    for (const cell of cells.values()) {
        currentLine[elementIndex] = cell;

        if (elementIndex % lineElements === 0) {
            if (line % 2 === 1) currentLine.reverse();

            result.push(currentLine);
            currentLine = [];
            line++;
        }

        elementIndex++;
    }

    return result.reverse();
}