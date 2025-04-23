import {Button, Flex, For, Grid, GridItem, Image, VisuallyHidden} from "@chakra-ui/react";
import {Cell} from "./Cell.jsx";
import {useCellsBoard} from "../pocketbase/cells.js";
import {useRef} from "react";
import {LuArrowBigDown, LuArrowBigUp} from "react-icons/lu";

export const Board = () => {
    const {cells} = useCellsBoard();

    const boardRef = useRef(null);
    const boardBottomRef = useRef(null);

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
            />
            <Image
                src="/src/assets/walls.png"
                position="absolute"
                width="80vw"
                zIndex={1}
                pointerEvents="none"
            />
            <Flex
                justify="flex-end"
                direction="column"
                position="absolute"
                ml="1.1%"
                mb="4.6%"
                gap=".6vw"
            >
                <For each={cells}>
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