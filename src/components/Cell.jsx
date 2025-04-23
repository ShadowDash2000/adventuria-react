import {Box, Image} from "@chakra-ui/react";
import {useAppContext} from "../context/AppContextProvider.jsx";
import {CellTooltip} from "./CellTooltip.jsx";
import {CellInfo} from "./CellInfoModal.jsx";

export const Cell = ({cell, width, height}) => {
    const {pb} = useAppContext();

    return (
        <Box
            position="relative"
            width={width}
            height={height}
        >
            <Image
                src={pb.files.getURL(cell, cell.icon)}
                width="100%"
                height="100%"
            />
            <CellTooltip cell={cell}>
                <CellInfo cell={cell} width={width} height={height}/>
            </CellTooltip>
        </Box>
    )
}