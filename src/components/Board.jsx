import {Flex, For, Grid, GridItem, Image} from "@chakra-ui/react";
import {Cell} from "./Cell.jsx";
import {useCellsBoard} from "../pocketbase/cells.js";

export const Board = () => {
    const {cells} = useCellsBoard();

    return (
        <Flex
            id="board"
            justify="center"
            align="flex-end"
            maxWidth="80vw"
        >
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
                ml=".6%"
                mb="3.6%"
                gap=".6vw"
            >
                <For each={cells}>
                    {(lineElements) => (
                        <Grid autoFlow="column">
                            <For each={lineElements}>
                                {(cell, cellNum) => (
                                    <GridItem key={cellNum}>
                                        <Cell
                                            cell={cell}
                                            width="9.5vw"
                                            height="6.2vw"
                                        />
                                    </GridItem>
                                )}
                            </For>
                        </Grid>
                    )}
                </For>
            </Flex>
        </Flex>
    )
}