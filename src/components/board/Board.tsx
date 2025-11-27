import {Button, Flex, Image} from "@chakra-ui/react";
import {createContext, useContext, useEffect, useRef, useState, useMemo} from "react";
import {LuArrowBigDown, LuArrowBigUp} from "react-icons/lu";
import {Players} from "./Players";
import type {CellRecord} from "@shared/types/cell";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {Cells} from "./Cells";
import type {RecordIdString} from "@shared/types/pocketbase";
import {BoardHelper} from "./BoardHelper";
import {useBoardDataContext} from "./BoardDataContext";

type BoardContextType = {
    cells: CellRecord[]
    cellsOrdered: CellRecord[][]
    cellsOrderedRev: CellRecord[][]
    cellsUsers: Map<RecordIdString, RecordIdString[]>
    users: Map<RecordIdString, UserRecord>
    boardDimensions: Dimension
    rows: number
    cols: number
    cellWidth: number
    cellHeight: number
}

export type PlayerMoveEvent = {
    prevCellsPassed: number
    cellsPassed: number
}

type Dimension = { width: number, height: number }

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const Board = () => {
    const {pb, isAuth} = useAppContext();
    const {users: usersRaw, cells: cellRaw} = useBoardDataContext();

    const [cells, setCells] = useState<CellRecord[]>(cellRaw);
    const [users, setUsers] = useState<Map<RecordIdString, UserRecord>>(
        new Map(usersRaw.map(u => [u.id, u]))
    );

    const cellsOrdered = useMemo(() => BoardHelper.buildCells(cells), [cells]);
    const cellsOrderedRev = useMemo(() => cellsOrdered.slice().reverse(), [cellsOrdered]);
    const cellsUsers = useMemo(() => {
        return BoardHelper.buildCellsUsers([...users.values()], cells)
    }, [users, cells]);

    // board container refs
    const boardRef = useRef<HTMLDivElement>(null);
    const boardInnerRef = useRef<HTMLDivElement>(null);

    // board geometry
    const [boardDimensions, setBoardDimensions] = useState<Dimension>({
        width: 0,
        height: 0,
    });

    // derived grid size
    const rows = cellsOrdered.length;
    const cols = rows > 0 ? cellsOrdered[0].length : 0;

    // derived cell size in px based on container size
    const {width: cellWidth, height: cellHeight} = useMemo((): Dimension => {
        const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
        const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;
        return {width: cellWidth, height: cellHeight};
    }, [boardDimensions.width, boardDimensions.height, rows, cols]);

    const scrollTo = (to: 'start' | 'end') => {
        boardRef.current?.scrollIntoView({block: to});
    };

    // observe board container size and update boardWidth/boardHeight
    useEffect(() => {
        const board = boardInnerRef.current;
        if (!board) return;

        const measure = () => {
            const rect = board.getBoundingClientRect();
            setBoardDimensions({width: rect.width, height: rect.height});
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

    useEffect(() => {
        if (!isAuth) return;

        pb.collection('users').subscribe<UserRecord>('*', (e) => {
            switch (e.action) {
                case 'create':
                    setUsers(prev => {
                        const next = new Map(prev);
                        next.set(e.record.id, e.record);
                        return next;
                    });
                    break;
                case 'update':
                    setUsers(prev => {
                        document.dispatchEvent(new CustomEvent(`player.move.${e.record.id}`, {
                            detail: {
                                prevCellsPassed: prev.get(e.record.id)!.cellsPassed,
                                cellsPassed: e.record.cellsPassed,
                            },
                        }));

                        const next = new Map(prev);
                        next.set(e.record.id, e.record);
                        return next;
                    });
                    break;
                case 'delete':
                    setUsers(prev => {
                        const next = new Map(prev);
                        next.delete(e.record.id);
                        return next;
                    })
                    break;
            }
        });

        return () => {
            pb.collection('users').unsubscribe();
        }
    }, [pb, isAuth]);

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
                onClick={() => scrollTo('end')}
                position="absolute"
                zIndex={2}
                top="0"
                rounded="full"
            >
                <LuArrowBigDown/>
            </Button>
            <Button
                onClick={() => scrollTo('start')}
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
                    cellsOrdered,
                    cellsOrderedRev,
                    cellsUsers,
                    users,
                    boardDimensions,
                    rows,
                    cols,
                    cellWidth,
                    cellHeight,
                }}>
                    <Cells/>
                    <Players/>
                </BoardContext.Provider>
            </Flex>
        </Flex>
    )
}

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);