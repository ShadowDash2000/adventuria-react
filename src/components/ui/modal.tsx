import {FC, ReactNode, useState} from "react";
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
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => {
            setOpen(e.open)
        }}>
            <Dialog.Trigger asChild>
                {trigger}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
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