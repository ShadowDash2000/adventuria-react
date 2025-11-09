import {Button, Flex, For, Grid, GridItem, Image, VisuallyHidden} from "@chakra-ui/react";
import {useMemo, useRef} from "react";
import {LuArrowBigDown, LuArrowBigUp} from "react-icons/lu";
import {useCollectionListAll} from "@context/CollectionListAllContext";
import {CellRecord} from "@shared/types/cell";
import {Cell} from "./Cell";
import {useCellsBoard} from "@shared/helpers/cells";

export const Board = () => {
    const {data: cells} = useCollectionListAll<CellRecord>();
    const cellsFormatted = useMemo(() => useCellsBoard(cells), []);
    const boardRef = useRef<HTMLDivElement>(null);
    const boardBottomRef = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        boardRef.current?.scrollIntoView();
    };
    const scrollToBottom = () => {
        boardBottomRef.current?.scrollIntoView();
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
                onClick={scrollToBottom}
                position="absolute"
                zIndex={2}
                top="0"
                transform="translateX(-50%)"
                rounded="full"
            >
                <LuArrowBigDown/>
            </Button>
            <Button
                onClick={scrollToTop}
                position="absolute"
                zIndex={2}
                bottom="0"
                transform="translateX(-50%)"
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
                <For each={cellsFormatted}>
                    {(lineElements, lineNum) => (
                        <Grid key={lineNum} autoFlow="column">
                            <For each={lineElements}>
                                {(cell, cellNum) => (
                                    <GridItem key={cellNum}>
                                        <Cell
                                            cell={cell}
                                            width="9.45vw"
                                            height="6.2vw"
                                        />
                                    </GridItem>
                                )}
                            </For>
                        </Grid>
                    )}
                </For>
            </Flex>
            <VisuallyHidden ref={boardBottomRef}/>
        </Flex>
    )
}