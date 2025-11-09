import {type FC, type ReactNode, useState} from "react";
import {CloseButton, Dialog, Portal} from "@chakra-ui/react";

interface ModalProps {
    title: string;
    trigger: ReactNode;
    children?: ReactNode;
}

export const Modal: FC<ModalProps> = (
    {
        title,
        trigger,
        children,
    }
) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root
            lazyMount
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
        >
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content
                        bgImage="linear-gradient(rgb(13, 34, 137), rgb(6, 9, 59))"
                        boxShadow="rgba(0, 0, 0, 0.3) 0 0 {spacing.1} {spacing.1} inset"
                        border="{spacing.0.5} solid rgb(198, 198, 198)"
                        borderRadius={12}
                        _before={{
                            content: '""',
                            pointerEvents: 'none',
                            inset: 0,
                            position: 'absolute',
                            border: '{spacing.1} solid white',
                            borderRadius: 10,
                        }}
                    >
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            {children}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm"/>
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}