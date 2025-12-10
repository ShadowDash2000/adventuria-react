import { Tooltip } from '@ui/tooltip';
import type { CellRecord } from '@shared/types/cell';
import { type ReactNode } from 'react';

type CellTooltipProps = { cell: CellRecord; children: ReactNode };

export const CellTooltip = ({ cell, children }: CellTooltipProps) => {
    return cell.description ? (
        <Tooltip
            showArrow
            content={<div dangerouslySetInnerHTML={{ __html: cell.description }} />}
            openDelay={0}
            closeDelay={0}
            positioning={{ placement: 'top' }}
        >
            {children}
        </Tooltip>
    ) : (
        <>{children}</>
    );
};
