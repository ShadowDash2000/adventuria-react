import {type FC} from "react";
import type {InventoryItemRecord} from "@shared/types/inventory-item";
import {For, Grid, Text} from "@chakra-ui/react";
import {InventoryItem} from "./InventoryItem";
import {type RecordIdString} from "@shared/types/pocketbase";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {useQuery} from "@tanstack/react-query";
import {LuLoader} from "react-icons/lu";

interface InventoryProps {
    userId: RecordIdString
}

export const Inventory: FC<InventoryProps> = ({userId}) => {
    const {pb, isAuth, user} = useAppContext();
    const inventory = useQuery({
        queryFn: () => {
            return pb.collection('inventory').getFullList<InventoryItemRecord>({
                filter: `user = "${userId}"`,
                expand: 'item,item.effects',
            });
        },
        queryKey: [userId],
    });

    if (inventory.isPending) return <LuLoader/>;
    if (inventory.isError) return <Text>Error: {inventory.error?.message}</Text>;

    return (
        <Grid templateColumns="repeat(2, 1fr)">
            <For each={inventory.data}>
                {((inv, index) => (
                    <InventoryItem
                        key={index}
                        item={inv.expand?.item!}
                        showControlButtons={isAuth && user?.id === userId}
                    />
                ))}
            </For>
        </Grid>
    )
}