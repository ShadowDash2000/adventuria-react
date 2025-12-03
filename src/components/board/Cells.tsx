import { For, Grid, GridItem } from '@chakra-ui/react';
import { Cell } from './Cell';
import { useBoardInnerContext } from './BoardInner';

export const Cells = () => {
    const { cellsOrderedRev } = useBoardInnerContext();

    return (
        <For each={cellsOrderedRev}>
            {(lineElements, lineNum) => (
                <Grid key={lineNum} autoFlow="column">
                    <For each={lineElements}>
                        {(cell, cellNum) => (
                            <GridItem key={cellNum}>
                                <Cell cell={cell} width="9.45vw" height="6.2vw" />
                            </GridItem>
                        )}
                    </For>
                </Grid>
            )}
        </For>
    );
};
