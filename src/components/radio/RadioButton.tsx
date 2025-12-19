import { useEffect, useState } from 'react';
import { Drawer, Float, HStack, IconButton, Kbd, Portal } from '@chakra-ui/react';
import { FaRadio } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { Radio } from '@components/radio/Radio';
import { KbdKey, useKbdSettings } from '@shared/hook/useKbdSettings';

export const RadioButton = () => {
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
            unmountOnExit
            placement="bottom"
            preventScroll={false}
        >
            <HStack position="relative">
                <Tooltip content="Радиопопия">
                    <Drawer.Trigger asChild>
                        <IconButton _hover={{ bg: 'green' }}>
                            <FaRadio />
                        </IconButton>
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
