import {Tooltip} from "@ui/tooltip";
import {CellRecord} from "@shared/types/cell";
import {FC, ReactNode} from "react";

type CellTooltipProps = {
    cell: CellRecord;
    children: ReactNode;
}

export const CellTooltip: FC<CellTooltipProps> = ({cell, children}) => {
    return (
        cell.description ?
            <Tooltip
                showArrow
                content={<div dangerouslySetInnerHTML={{__html: cell.description}}/>}
                openDelay={0}
                closeDelay={0}
                positioning={{placement: "top"}}
            >
                {children}
            </Tooltip>
            : <>{children}</>
    )
}