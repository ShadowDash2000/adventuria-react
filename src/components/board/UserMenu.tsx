import {type FC, useMemo} from "react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {ActionFactory} from "@shared/types/actions/action-factory";
import {Flex} from "@chakra-ui/react";
import {PlayerInventory} from "./inventory/PlayerInventory";

export const UserMenu: FC = () => {
    const {availableActions, user} = useAppContext();
    const actionButton = useMemo(() => {
        return ActionFactory.getFirstAvailableAction(availableActions)?.buttonNode();
    }, [availableActions]);

    return (
        <Flex
            position="fixed"
            bottom={0}
            zIndex={100}
            py={10}
            justify="center"
            align="center"
        >
            {actionButton}
            <PlayerInventory userId={user?.id!}/>
        </Flex>
    )
}