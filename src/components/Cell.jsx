import {Box, Image} from "@chakra-ui/react";
import {useAppContext} from "../context/AppContextProvider.jsx";
import {CellTooltip} from "./CellTooltip.jsx";

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
                <Box
                    top={0}
                    zIndex={2}
                    position="absolute"
                    borderWidth=".2vw"
                    borderColor={{base: "transparent", _hover: "border.inverted"}}
                    width={width}
                    height={height}
                />
            </CellTooltip>
        </Box>
    )
}