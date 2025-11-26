import {type FC} from "react";
import type {RecordIdString} from "@shared/types/pocketbase";
import {Inventory} from "./Inventory";
import {useQuery} from "@tanstack/react-query";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import type {InventoryItemRecord} from "@shared/types/inventory-item";
import {LuLoader} from "react-icons/lu";
import {Text} from "@chakra-ui/react";

interface PlayerInventoryProps {
    userId: RecordIdString
}

export const PlayerInventory: FC<PlayerInventoryProps> = ({userId}) => {
    const {pb} = useAppContext();
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
        <Inventory inventory={inventory.data}/>
    );
}