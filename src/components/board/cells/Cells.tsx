import { For, Grid, GridItem } from '@chakra-ui/react';
import { Cell } from './Cell';
import { useBoardInnerContext } from '@components/board';

export const Cells = () => {
    const { cellsOrderedRev } = useBoardInnerContext();

    return (
        <For each={cellsOrderedRev}>
            {(lineElements, lineNum) => (
                <Grid key={lineNum} autoFlow="column" justifyContent="start" gapX="4px">
                    <For each={lineElements}>
                        {(cell, cellNum) => (
                            <GridItem key={cellNum}>
                                <Cell cell={cell} width="190px" height="128px" zIndex={10} />
                            </GridItem>
                        )}
                    </For>
                </Grid>
            )}
        </For>
    );
};
