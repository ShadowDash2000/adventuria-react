import {type FC, useState} from "react";
import {CloseButton, Dialog, Portal, useTabs} from "@chakra-ui/react";
import {Button} from "@ui/button";

export const RollWheelModal: FC = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Dialog.Root
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={(e) => setOpen(e.open)}
            size="full"
        >
            <Dialog.Trigger asChild>
                <Button>Колесо</Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop
                    bg="none"
                    backdropFilter="blur(0.2vw)"
                ></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content
                        bg="none"
                        boxShadow="none"
                        mt={0}
                        display="flex"
                    >
                        <Dialog.Body>

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