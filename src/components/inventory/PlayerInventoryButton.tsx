import { useEffect, useState } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { Inventory } from './Inventory';
import { Tooltip } from '@ui/tooltip';
import { CloseButton, Drawer, IconButton, Kbd, Portal, VStack } from '@chakra-ui/react';
import { GiSwapBag } from 'react-icons/gi';

interface PlayerInventoryButtonProps {
    userId: RecordIdString;
    kbd?: boolean;
}

export const PlayerInventoryButton = ({ userId, kbd = false }: PlayerInventoryButtonProps) => {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        if (!kbd) return;

        const abortController = new AbortController();

        window.addEventListener(
            'keydown',
            e => {
                if (e.code !== 'KeyI') return;
                setOpen(prev => !prev);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [kbd]);

    return (
        <Drawer.Root
            lazyMount
            unmountOnExit
            size="lg"
            open={open}
            onOpenChange={e => setOpen(e.open)}
        >
            <VStack>
                <Tooltip content="Радиопопия">
                    <Drawer.Trigger asChild>
                        <IconButton _hover={{ bg: 'blue' }}>
                            <GiSwapBag />
                        </IconButton>
                    </Drawer.Trigger>
                </Tooltip>
                {kbd && <Kbd>I</Kbd>}
            </VStack>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header />
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
