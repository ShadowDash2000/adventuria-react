import { type FC, type JSX } from 'react';
import type { RecordIdString } from '@shared/types/pocketbase';
import { Inventory } from './Inventory';
import { Drawer } from '@ui/drawer';

interface PlayerInventoryProps {
    userId: RecordIdString;
    trigger: JSX.Element;
}

export const PlayerInventory: FC<PlayerInventoryProps> = ({ userId, trigger }) => {
    return (
        <Drawer lazyMount unmountOnExit trigger={trigger} size="lg">
            <Inventory userId={userId} />
        </Drawer>
    );
};
