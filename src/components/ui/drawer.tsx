import {CloseButton, Drawer as ChakraDrawer, type DrawerRootProps, Portal} from "@chakra-ui/react"
import {type FC, type ReactNode} from "react";

interface DrawerProps extends DrawerRootProps {
    trigger?: ReactNode
    title?: string
    children: ReactNode
}

export const Drawer: FC<DrawerProps> = (
    {
        trigger,
        title,
        children,
        ...props
    }
) => {
    return (
        <ChakraDrawer.Root {...props}>
            <ChakraDrawer.Trigger asChild>
                {trigger}
            </ChakraDrawer.Trigger>
            <Portal>
                <ChakraDrawer.Backdrop/>
                <ChakraDrawer.Positioner>
                    <ChakraDrawer.Content>
                        <ChakraDrawer.Header>
                            <ChakraDrawer.Title>{title}</ChakraDrawer.Title>
                        </ChakraDrawer.Header>
                        <ChakraDrawer.Body>
                            {children}
                        </ChakraDrawer.Body>
                        <ChakraDrawer.CloseTrigger asChild>
                            <CloseButton size="sm"/>
                        </ChakraDrawer.CloseTrigger>
                    </ChakraDrawer.Content>
                </ChakraDrawer.Positioner>
            </Portal>
        </ChakraDrawer.Root>
    )
}