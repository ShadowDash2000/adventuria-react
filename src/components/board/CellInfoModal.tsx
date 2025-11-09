import type {FC, ReactNode} from "react";
import {Image, Blockquote, Stack} from "@chakra-ui/react";
import HTMLReactParser from "html-react-parser";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {CellRecord} from "@shared/types/cell";
import {Modal} from "@ui/modal";

type CellInfoProps = {
    cell: CellRecord;
    children?: ReactNode;
}

export const CellInfo: FC<CellInfoProps> = ({cell, children}) => {
    const {pb} = useAppContext();

    return (
        <Modal title={cell.name} trigger={children}>
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
        </Modal>
    )
}