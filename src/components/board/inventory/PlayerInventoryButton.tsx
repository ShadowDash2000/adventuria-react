import { type FC } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { Inventory } from './Inventory';
import { Tooltip } from '@ui/tooltip';
import { CloseButton, Drawer, IconButton, Portal } from '@chakra-ui/react';
import { GiSwapBag } from 'react-icons/gi';

interface PlayerInventoryButtonProps {
    userId: RecordIdString;
}

export const PlayerInventoryButton: FC<PlayerInventoryButtonProps> = ({ userId }) => {
    return (
        <Drawer.Root lazyMount unmountOnExit size="lg">
            <Tooltip content="Инвентарь">
                <Drawer.Trigger asChild>
                    <IconButton _hover={{ bg: 'blue' }}>
                        <GiSwapBag />
                    </IconButton>
                </Drawer.Trigger>
            </Tooltip>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Body>
                            <Inventory userId={userId} />
                        </Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
