import {FC, ReactNode, useState} from "react";
import {CloseButton, Dialog, Portal, Image, Blockquote, Stack} from "@chakra-ui/react";
import HTMLReactParser from "html-react-parser";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {CellRecord} from "@shared/types/cell";

type CellInfoProps = {
    cell: CellRecord;
    children?: ReactNode;
}

export const CellInfo: FC<CellInfoProps> = ({cell, children}) => {
    const {pb} = useAppContext();
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => {
            setOpen(e.open)
        }}>
            <Dialog.Trigger asChild>
                {children}
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{cell.name}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack>
                                <Blockquote.Root>
                                    <Blockquote.Content>
                                        {HTMLReactParser(cell.description)}
                                    </Blockquote.Content>
                                </Blockquote.Root>
                                <Image
                                    src={pb.files.getURL(cell, cell.icon)}
                                    width="100%"
                                    height="100%"
                                />
                            </Stack>
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