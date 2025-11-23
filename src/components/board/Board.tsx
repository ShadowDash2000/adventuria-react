import {Button, Flex, Image, VisuallyHidden} from "@chakra-ui/react";
import {createContext, useContext, useEffect, useRef, useState, useMemo} from "react";
import {LuArrowBigDown, LuArrowBigUp} from "react-icons/lu";
import {Players} from "./Players";
import type {CellRecord} from "@shared/types/cell";
import type {UserRecord} from "@shared/types/user";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {useQuery} from "@tanstack/react-query";
import {Cells} from "./Cells";
import type {RecordIdString} from "@shared/types/pocketbase";
import {BoardHelper} from "./BoardHelper";

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
    const {pb} = useAppContext();
    const [cells, setCells] = useState<CellRecord[]>([]);
    const [cellsOrdered, setCellsOrdered] = useState<CellRecord[][]>([]);
    const [cellsOrderedRev, setCellsOrderedRev] = useState<CellRecord[][]>([]);
    const [users, setUsers] = useState<Map<RecordIdString, UserRecord>>(new Map());
    const [cellsUsers, setCellsUsers] = useState<Map<RecordIdString, RecordIdString[]>>(new Map());

    useEffect(() => {
        const c = BoardHelper.buildCells(cells);
        setCellsOrdered(c);
        setCellsOrderedRev(c.slice().reverse());
    }, [cells]);

    useEffect(() => {
        if (!cells.length || !users.size) return;

        setCellsUsers(BoardHelper.buildCellsUsers([...users.values()], cells));
    }, [cells, users]);

    // board container refs
    const boardRef = useRef<HTMLDivElement>(null);
    const boardBottomRef = useRef<HTMLDivElement>(null);
    const boardInnerRef = useRef<HTMLDivElement>(null);

    // board geometry
    const [boardDimensions, setBoardDimensions] = useState<Dimension>({
        width: 0,
        height: 0,
    });

    // derived grid size
    const rows = cellsOrderedRev.length;
    const cols = rows > 0 ? cellsOrderedRev[cellsOrderedRev.length - 1].length : 0;

    // derived cell size in px based on container size
    const {width: cellWidth, height: cellHeight} = useMemo((): Dimension => {
        const cellWidth = cols ? Math.floor(boardDimensions.width / Math.max(cols, 1)) : 0;
        const cellHeight = rows ? Math.floor(boardDimensions.height / Math.max(rows, 1)) : 0;
        return {width: cellWidth, height: cellHeight};
    }, [boardDimensions.width, boardDimensions.height]);

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

    useQuery({
        queryKey: ['board'],
        queryFn: async () => {
            const cells = await pb.collection('cells').getFullList<CellRecord>({
                sort: 'sort',
            });
            setCells(cells);

            const users = await pb.collection('users').getFullList<UserRecord>();
            setUsers(new Map(users.map(u => [u.id, u])));

            return {cells, users};
        },
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        pb.collection('users').subscribe<UserRecord>('*', (e) => {
            switch (e.action) {
                case 'create':
                    setUsers(prev => new Map(prev.set(e.record.id, e.record)));
                    break;
                case 'update':
                    setUsers(prev => {
                        document.dispatchEvent(new CustomEvent(`player.move.${e.record.id}`, {
                            detail: {
                                prevCellsPassed: prev.get(e.record.id)!.cellsPassed,
                                cellsPassed: e.record.cellsPassed,
                            },
                        }));

                        return new Map(prev.set(e.record.id, e.record));
                    });
                    break;
                case 'delete':
                    setUsers(prev => {
                        prev.delete(e.record.id);
                        return new Map(prev);
                    })
                    break;
            }
        });

        return () => {
            pb.collection('users').unsubscribe();
        }
    }, []);

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
            <VisuallyHidden ref={boardBottomRef}/>
        </Flex>
    )
}

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);