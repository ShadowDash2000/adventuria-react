import './radio.css';
import { useEffect, useState } from 'react';
import { Drawer, Float, HStack, Kbd, Portal } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { Radio } from './Radio';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';
import { RadioBackgroundController } from './RadioBackgroundController';
import { RadioButton } from '@components/radio/RadioButton';

export const RadioDrawer = () => {
    const [open, setOpen] = useState<boolean>(false);
    const { isBlocked } = useKbdSettings(KbdKey.radio);

    useEffect(() => {
        const abortController = new AbortController();

        window.addEventListener(
            'keydown',
            e => {
                if (e.code !== KbdKey.radio || isBlocked) return;
                setOpen(prev => !prev);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, [isBlocked]);

    return (
        <Drawer.Root
            open={open}
            onOpenChange={e => setOpen(e.open)}
            lazyMount
            placement="bottom"
            preventScroll={false}
        >
            <RadioBackgroundController />
            <HStack position="relative">
                <Tooltip content="Радиопопия">
                    <Drawer.Trigger asChild>
                        <RadioButton _hover={{ bg: 'green' }} />
                    </Drawer.Trigger>
                </Tooltip>
                <Float pl={2} translate="100% 50%">
                    <Kbd>P</Kbd>
                </Float>
            </HStack>
            <Portal>
                <Drawer.Positioner>
                    <Drawer.Content bg="rgba(0,0,0,0.5)" backdropFilter="blur({sizes.12})">
                        <Drawer.Body>
                            <Radio />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
