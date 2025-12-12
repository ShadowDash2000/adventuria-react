import { Button, Flex, Image } from '@chakra-ui/react';
import { LuArrowBigDown, LuArrowBigUp } from 'react-icons/lu';
import { createContext, RefObject, useContext, useRef } from 'react';
import { BoardInner } from './BoardInner';
import { BoardDataProvider } from './BoardDataContext';
import BuildingImage from '/building.png';
import WallsImage from '/walls.png';

type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

export const CELL_MAX_USERS_LINE = 3;
export const CELL_MAX_USERS = 6;

export const BoardContext = createContext<BoardContextType>({} as BoardContextType);

export const Board = () => {
    // board container refs
    const boardRef = useRef<HTMLDivElement>(null);
    const boardInnerRef = useRef<HTMLDivElement>(null);

    const scrollTo = (to: 'start' | 'end') => {
        boardRef.current?.scrollIntoView({ block: to });
    };

    return (
        <Flex
            ref={boardRef}
            id="board"
            justify="center"
            align="flex-end"
            w="1642px"
            h="2426px"
            position="relative"
        >
            <Button
                onClick={() => scrollTo('end')}
                position="absolute"
                zIndex={2}
                top="0"
                rounded="full"
            >
                <LuArrowBigDown />
            </Button>
            <Button
                onClick={() => scrollTo('start')}
                position="absolute"
                zIndex={2}
                bottom="0"
                rounded="full"
            >
                <LuArrowBigUp />
            </Button>
            <Image
                src={BuildingImage}
                position="absolute"
                rounded="3rem"
                width="100%"
                zIndex={1}
                pointerEvents="none"
                userSelect="none"
            />
            <Image
                src={WallsImage}
                position="absolute"
                width="100%"
                zIndex={20}
                pointerEvents="none"
                userSelect="none"
            />
            <Flex
                ref={boardInnerRef}
                justify="flex-end"
                direction="column"
                position="absolute"
                left={0}
                bottom={0}
                ml="151px"
                mb="4.6%"
                gapY="10.6px"
            >
                <BoardContext.Provider value={{ boardRef, boardInnerRef }}>
                    <BoardDataProvider>
                        <BoardInner />
                    </BoardDataProvider>
                </BoardContext.Provider>
            </Flex>
        </Flex>
    );
};

export const useBoardContext: () => BoardContextType = () => useContext(BoardContext);
