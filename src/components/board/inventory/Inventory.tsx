import {type FC} from "react";
import {Drawer} from "@ui/drawer";
import type {InventoryItemRecord} from "@shared/types/inventory-item";
import {For, Grid} from "@chakra-ui/react";
import {InventoryItem} from "./InventoryItem";
import {Button} from "@ui/button";

interface InventoryProps {
    inventory: InventoryItemRecord[]
}

export const Inventory: FC<InventoryProps> = (
    {
        inventory
    }
) => {
    return (
        <Drawer
            lazyMount
            unmountOnExit
            trigger={<Button>Инвентарь</Button>}
            size="lg"
        >
            <Grid templateColumns="repeat(2, 1fr)">
                <For each={inventory}>
                    {((inv, index) => (
                        <InventoryItem item={inv.expand?.item!} key={index}/>
                    ))}
                </For>
            </Grid>
        </Drawer>
    );
}