import {useState} from "react";
import {CloseButton, Dialog, Portal, Box, Image, Blockquote, Stack} from "@chakra-ui/react";
import {useAppContext} from "../context/AppContextProvider.jsx";
import HTMLReactParser from "html-react-parser";

export const CellInfo = ({cell, width, height}) => {
    const {pb} = useAppContext();
    const [open, setOpen] = useState(false);

    return (
        <Dialog.Root lazyMount open={open} onOpenChange={(e) => {
            setOpen(e.open)
        }}>
            <Dialog.Trigger asChild>
                <Box
                    top={0}
                    zIndex={2}
                    position="absolute"
                    borderWidth=".2vw"
                    borderColor={{base: "transparent", _hover: "border.inverted"}}
                    width={width}
                    height={height}
                />
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