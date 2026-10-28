import type { CellBoard, LineBoard } from '@components/board/BoardHelper';
import { CellType } from '@shared/types/cell';
import { For, Grid, GridItem, Icon, type IconProps, Text } from '@chakra-ui/react';
import { Fragment } from 'react';
import { Cell } from './Cell';
import { useBoardInnerContext } from '@components/board';
import { useCellsStore } from '@components/board/useCellsStore';
import { useSettingsStore } from '@components/settings/useSettingsStore';
import { useCellContextMenuStore } from '@components/debug/cell-context-menu/useCellContextMenuStore';
import { FaArrowLeftLong, FaArrowRightLong, FaArrowUpLong } from 'react-icons/fa6';
import { GiTeleport } from 'react-icons/gi';
import { FaFlagCheckered } from 'react-icons/fa';

export const Cells = () => {
    const { worldsById } = useBoardInnerContext();
    const openCellInfo = useCellsStore(state => state.openCellInfo);
    const openCellContextMenu = useCellContextMenuStore(state => state.openMenu);
    const displayCellsNumber = useSettingsStore(state => state.displayCellsNumber);
    const displayCellsDirection = useSettingsStore(state => state.displayCellsDirection);

    return (
        <For each={Array.from(worldsById.values()).reverse()}>
            {world => (
                <Fragment key={world.id}>
                    <For each={world.lines.slice().reverse()}>
                        {line => (
                            <Grid
                                key={line.startIndex}
                                autoFlow="column"
                                justifyContent="start"
                                gapX="4px"
                            >
                                <For each={line.cells}>
                                    {cell => (
                                        <GridItem
                                            position="relative"
                                            key={cell.record.id}
                                            userSelect="none"
                                        >
                                            <Cell
                                                cell={cell.record}
                                                width="190px"
                                                height="128px"
                                                zIndex={10}
                                                onClick={() => openCellInfo(cell.record.id)}
                                                onContextMenu={e => {
                                                    e.preventDefault();
                                                    openCellContextMenu(
                                                        cell.record.id,
                                                        e.currentTarget,
                                                    );
                                                }}
                                            />
                                            {displayCellsDirection && (
                                                <DirectionIcon
                                                    line={line}
                                                    cell={cell}
                                                    w={8}
                                                    h={8}
                                                    position="absolute"
                                                    top={0}
                                                    right={0}
                                                    transform="translateX(-50%)"
                                                    pointerEvents="none"
                                                    zIndex={10}
                                                    stroke="black"
                                                    strokeWidth={24}
                                                    opacity={0.8}
                                                />
                                            )}
                                            {displayCellsNumber && (
                                                <Text
                                                    position="absolute"
                                                    bottom={0}
                                                    right={0}
                                                    px={2}
                                                    zIndex={15}
                                                    fontSize={14}
                                                    bgGradient="{gradients.psone}"
                                                >
                                                    {cell.localIndex + 1}
                                                </Text>
                                            )}
                                        </GridItem>
                                    )}
                                </For>
                            </Grid>
                        )}
                    </For>
                </Fragment>
            )}
        </For>
    );
};

interface DirectionIconProps extends IconProps {
    line: LineBoard;
    cell: CellBoard;
}

const DirectionIcon = ({ line, cell, ...props }: DirectionIconProps) => {
    if (cell.isLastInWorld) {
        return (
            <Icon {...props}>
                <FaFlagCheckered />
            </Icon>
        );
    }

    if (cell.record.type === CellType.Teleport) {
        return (
            <Icon {...props}>
                <GiTeleport />
            </Icon>
        );
    }

    if (cell.isLastInLine) {
        return (
            <Icon {...props}>
                <FaArrowUpLong />
            </Icon>
        );
    }

    return (
        <Icon {...props}>
            {line.reversed && <FaArrowLeftLong />}
            {!line.reversed && <FaArrowRightLong />}
        </Icon>
    );
};
