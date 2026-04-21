import { useEffect, useState } from 'react';
import { Inventory } from './Inventory';
import { Tooltip } from '@ui/tooltip';
import { Drawer, Float, HStack, IconButton, Kbd, Portal } from '@chakra-ui/react';
import { GiSwapBag } from 'react-icons/gi';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';
import { useRollWheelStore } from '@components/actions/roll-wheel/useRollWheelStore';
import type { PlayerRecord } from '@shared/types/player';

interface PlayerInventoryButtonProps {
    player: PlayerRecord;
    kbd?: boolean;
}

export const PlayerInventoryButton = ({ player, kbd = false }: PlayerInventoryButtonProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const { isBlocked } = useKbdSettings(KbdKey.inventory);
    const isSpinning = useRollWheelStore(state => state.isSpinning);
    const disabled = isBlocked || isSpinning;

    useEffect(() => {
        if (!kbd) return;

        const abortController = new AbortController();

        window.addEventListener(
            'keydown',
            e => {
                if (e.code !== KbdKey.inventory || disabled) return;
                setOpen(prev => !prev);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [kbd, disabled]);

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
                        <IconButton disabled={disabled} _hover={{ bg: 'blue' }}>
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
                        <Inventory player={player} />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
