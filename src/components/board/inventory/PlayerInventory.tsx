import {type FC} from "react";
import type {RecordIdString} from "@shared/types/pocketbase";
import {Inventory} from "./Inventory";
import {Drawer} from "@ui/drawer";
import {Button} from "@ui/button";

interface PlayerInventoryProps {
    userId: RecordIdString
}

export const PlayerInventory: FC<PlayerInventoryProps> = ({userId}) => {
    return (
        <Drawer
            lazyMount
            unmountOnExit
            trigger={<Button>Инвентарь</Button>}
            size="lg"
        >
            <Inventory userId={userId}/>
        </Drawer>
    )
}