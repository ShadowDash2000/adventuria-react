import {Box, Image} from "@chakra-ui/react";
import {CellRecord} from "@shared/types/cell";
import {FC} from "react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {CellTooltip} from "./CellTooltip";
import {CellInfo} from "./CellInfoModal";

type CellProps = {
    cell: CellRecord;
    width: number | string;
    height: number | string;
}

export const Cell: FC<CellProps> = ({cell, width, height}) => {
    const {pb} = useAppContext();

    return (
        <Box
            position="relative"
            width={width}
            height={height}
        >
            <CellInfo cell={cell}>
                <Box
                    top={0}
                    zIndex={2}
                    position="absolute"
                    borderWidth=".2vw"
                    borderColor={{base: "transparent", _hover: "border.inverted"}}
                    width={width}
                    height={height}
                >
                    <CellTooltip cell={cell}>
                        <Image
                            src={pb.files.getURL(cell, cell.icon)}
                            width="100%"
                            height="100%"
                        />
                    </CellTooltip>
                </Box>
            </CellInfo>
        </Box>
    )
}