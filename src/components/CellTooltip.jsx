import {Tooltip} from "./ui/tooltip.jsx";

export const CellTooltip = ({cell, children}) => {


    return (
        cell.description ?
            <Tooltip
                showArrow
                content={<div dangerouslySetInnerHTML={{__html: cell.description}}/>}
                openDelay={0}
                closeDelay={0}
                positioning={{placement: "top-center"}}
            >
                {children}
            </Tooltip>
            : <>{children}</>
    )
}