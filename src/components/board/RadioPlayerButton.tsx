import { type FC, useEffect, useState } from 'react';
import { CloseButton, Drawer, IconButton, Kbd, Portal, VStack } from '@chakra-ui/react';
import { FaRadio } from 'react-icons/fa6';
import { Tooltip } from '@ui/tooltip';

export const RadioPlayerButton: FC = () => {
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
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Test</Drawer.Title>
                        </Drawer.Header>
                        <Drawer.Body></Drawer.Body>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
