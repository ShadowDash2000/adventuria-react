import {Button, Flex, Image, VisuallyHidden} from "@chakra-ui/react";
import {createContext, useContext, useEffect, useRef, useState, type RefObject} from "react";
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
    boardRef: RefObject<HTMLDivElement | null>
    boardWidth: number
    boardHeight: number
    rows: number
    cols: number
    cellWidth: number
    cellHeight: number
}

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const Board = () => {
    const {pb} = useAppContext();
    const [cells, setCells] = useState<CellRecord[][]>([]);
    const [users, setUsers] = useState<UserRecord[]>([]);

    // board container refs
    const boardRef = useRef<HTMLDivElement>(null);
    const boardBottomRef = useRef<HTMLDivElement>(null);
    const boardInnerRef = useRef<HTMLDivElement>(null);

    // board geometry
    const [boardWidth, setBoardWidth] = useState(0);
    const [boardHeight, setBoardHeight] = useState(0);

    // derived grid size
    const rows = cells.length;
    const cols = rows > 0 ? cells[cells.length - 1].length : 0;

    // derived cell size in px based on container size
    const cellWidth = cols ? Math.floor(boardWidth / Math.max(cols, 1)) : 0;
    const cellHeight = rows ? Math.floor(boardHeight / Math.max(rows, 1)) : 0;

    const scrollToTop = () => {
        boardRef.current?.scrollIntoView();
    };
    const scrollToBottom = () => {
        boardBottomRef.current?.scrollIntoView();
    };

    // observe board container size and update boardWidth/boardHeight
    useEffect(() => {
        const board = boardInnerRef.current;
        if (!board) return;

        const measure = () => {
            const rect = board.getBoundingClientRect();
            setBoardWidth(Math.floor(rect.width));
            setBoardHeight(Math.floor(rect.height));
        };

        // initial measure
        measure();

        const ro = new ResizeObserver(() => {
            measure();
        });
        ro.observe(board);

        return () => {
            ro.disconnect();
        };
    }, []);

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
                ref={boardInnerRef}
                justify="flex-end"
                direction="column"
                position="absolute"
                ml="1.1%"
                mb="4.6%"
                gap=".6vw"
            >
                <BoardContext.Provider value={{
                    cells,
                    users,
                    boardRef,
                    boardWidth,
                    boardHeight,
                    rows,
                    cols,
                    cellWidth,
                    cellHeight,
                }}>
                    <Cells/>
                    <Players/>
                </BoardContext.Provider>
            </Flex>
            <VisuallyHidden ref={boardBottomRef}/>
        </Flex>
    )
}

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);

const buildCells = (cells: CellRecord[], lineSize = 7) => {
    if (cells.length === 0) return [];

    const lines: CellRecord[][] = [];
    let currentLine: CellRecord[] = [];

    for (let i = 0; i < cells.length; i++) {
        currentLine.push(cells[i]);

        const isLineFull = currentLine.length === Math.min(lineSize, cells.length);
        const isLast = i === cells.length - 1;

        if (isLineFull || isLast) {
            if (lines.length % 2 === 1) currentLine.reverse();
            lines.push(currentLine);
            currentLine = [];
        }
    }

    return lines.reverse();
}