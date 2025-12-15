import { For, Grid, GridItem } from '@chakra-ui/react';
import { Cell } from './Cell';
import { useBoardInnerContext } from '@components/board';

export const Cells = () => {
    const { cellsOrderedRev } = useBoardInnerContext();

    return (
        <For each={cellsOrderedRev}>
            {(lineElements, lineNum) => (
                <Grid key={lineNum} autoFlow="column" gapX="6.6px">
                    <For each={lineElements}>
                        {(cell, cellNum) => (
                            <GridItem key={cellNum}>
                                <Cell cell={cell} width="188px" height="126px" zIndex={10} />
                            </GridItem>
                        )}
                    </For>
                </Grid>
            )}
        </For>
    );
};
