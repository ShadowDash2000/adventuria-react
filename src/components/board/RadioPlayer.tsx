import { type FC, JSX } from 'react';
import { CloseButton, Drawer, Portal } from '@chakra-ui/react';

interface RadioPlayerProps {
    trigger: JSX.Element;
}

export const RadioPlayer: FC<RadioPlayerProps> = ({ trigger }) => {
    return (
        <Drawer.Root placement="bottom">
            <Drawer.Trigger>{trigger}</Drawer.Trigger>
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
