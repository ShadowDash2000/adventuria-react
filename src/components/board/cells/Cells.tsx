import { For, Grid, GridItem } from '@chakra-ui/react';
import { Cell } from './Cell';
import { useBoardInnerContext } from '@components/board';
import { useCellsStore } from '@components/board/useCellsStore';

export const Cells = () => {
    const { cellsOrderedRev } = useBoardInnerContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);

    return (
        <>
            <For each={cellsOrderedRev}>
                {(lineElements, lineNum) => (
                    <Grid key={lineNum} autoFlow="column" justifyContent="start" gapX="4px">
                        <For each={lineElements}>
                            {(cell, cellNum) => (
                                <GridItem key={cellNum}>
                                    <Cell
                                        cell={cell}
                                        width="190px"
                                        height="128px"
                                        zIndex={10}
                                        onClick={() => openCellInfo(cell.id)}
                                    />
                                </GridItem>
                            )}
                        </For>
                    </Grid>
                )}
            </For>
        </>
    );
};
