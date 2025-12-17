import { useEffect, useState } from 'react';
import { CloseButton, Drawer, IconButton, Kbd, Portal, VStack } from '@chakra-ui/react';
import { FaRadio } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';
import { Radio } from '@components/radio/Radio';

export const RadioButton = () => {
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const abortController = new AbortController();

        window.addEventListener(
            'keydown',
            e => {
                if (e.code !== 'KeyP') return;
                setOpen(prev => !prev);
            },
            { signal: abortController.signal },
        );

        return () => {
            abortController.abort();
        };
    }, []);

    return (
        <Drawer.Root
            open={open}
            onOpenChange={e => setOpen(e.open)}
            lazyMount
            unmountOnExit
            placement="bottom"
            preventScroll={false}
        >
            <VStack>
                <Tooltip content="Радиопопия">
                    <Drawer.Trigger asChild>
                        <IconButton _hover={{ bg: 'green' }}>
                            <FaRadio />
                        </IconButton>
                    </Drawer.Trigger>
                </Tooltip>
                <Kbd>P</Kbd>
            </VStack>
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
