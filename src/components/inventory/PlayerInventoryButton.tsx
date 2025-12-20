import { useEffect, useState } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { Inventory } from './Inventory';
import { Tooltip } from '@ui/tooltip';
import { CloseButton, Drawer, Float, HStack, IconButton, Kbd, Portal } from '@chakra-ui/react';
import { GiSwapBag } from 'react-icons/gi';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';

interface PlayerInventoryButtonProps {
    userId: RecordIdString;
    kbd?: boolean;
}

export const PlayerInventoryButton = ({ userId, kbd = false }: PlayerInventoryButtonProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { isBlocked } = useKbdSettings(KbdKey.inventory);

    useEffect(() => {
        if (!kbd) return;

        const abortController = new AbortController();

        window.addEventListener(
            'keydown',
            e => {
                if (e.code !== KbdKey.inventory || isBlocked) return;
                setOpen(prev => !prev);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [kbd, isBlocked]);

    return (
        <Drawer.Root
            lazyMount
            unmountOnExit
            size="lg"
            open={open}
            onOpenChange={e => setOpen(e.open)}
        >
            <HStack position="relative">
                <Tooltip content="Инвентарь">
                    <Drawer.Trigger asChild>
                        <IconButton disabled={isBlocked} _hover={{ bg: 'blue' }}>
                            <GiSwapBag />
                        </IconButton>
                    </Drawer.Trigger>
                </Tooltip>
                <Float pl={2} translate="100% 50%">
                    {kbd && <Kbd>I</Kbd>}
                </Float>
            </HStack>
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
