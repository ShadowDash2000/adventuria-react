import { Button, Flex, Image } from '@chakra-ui/react';
import { LuArrowBigDown, LuArrowBigUp } from 'react-icons/lu';
import { createContext, RefObject, useContext, useRef } from 'react';
import { BoardInner } from './BoardInner';
import { BoardDataProvider } from './BoardDataContext';

type BoardContextType = {
    boardRef: RefObject<HTMLDivElement | null>;
    boardInnerRef: RefObject<HTMLDivElement | null>;
};

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
