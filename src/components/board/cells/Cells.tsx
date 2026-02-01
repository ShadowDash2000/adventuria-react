import { For, Grid, GridItem, Text } from '@chakra-ui/react';
import { Cell } from './Cell';
import { useBoardInnerContext } from '@components/board';
import { useCellsStore } from '@components/board/useCellsStore';
import { useSettingsStore } from '@components/settings/useSettingsStore';

export const Cells = () => {
    const { cellsOrderedRev } = useBoardInnerContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);
    const displayCellsNumber = useSettingsStore(state => state.displayCellsNumber);

    const rowStarts = cellsOrderedRev.reduce<number[]>((acc, _line, index) => {
        const prevTotal = index === 0 ? 0 : acc[index - 1] + cellsOrderedRev[index - 1].length;
        acc.push(prevTotal);
        return acc;
    }, []);
    const totalCells =
        cellsOrderedRev.length === 0
            ? 0
            : rowStarts[rowStarts.length - 1] + cellsOrderedRev[cellsOrderedRev.length - 1].length;

    return (
        <>
            <For each={cellsOrderedRev}>
                {(lineElements, lineNum) => (
                    <Grid key={lineNum} autoFlow="column" justifyContent="start" gapX="4px">
                        <For each={lineElements}>
                            {(cell, cellNum) => (
                                <GridItem position="relative" key={cellNum}>
                                    <Cell
                                        cell={cell}
                                        width="190px"
                                        height="128px"
                                        zIndex={10}
                                        onClick={() => openCellInfo(cell.id)}
                                    />
                                    {displayCellsNumber && (
                                        <Text
                                            position="absolute"
                                            bottom={0}
                                            right={0}
                                            px={2}
                                            zIndex={11}
                                            fontSize={14}
                                            bgGradient="{gradients.psone}"
                                        >
                                            {(() => {
                                                const isReversed = lineNum % 2 === 1;
                                                const indexInRow = isReversed
                                                    ? lineElements.length - 1 - cellNum
                                                    : cellNum;
                                                return (
                                                    totalCells - (rowStarts[lineNum] + indexInRow)
                                                );
                                            })()}
                                        </Text>
                                    )}
                                </GridItem>
                            )}
                        </For>
                    </Grid>
                )}
            </For>
        </>
    );
};
