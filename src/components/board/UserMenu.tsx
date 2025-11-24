import type {FC} from "react";
import {useAppContext} from "@context/AppContextProvider/AppContextProvider";
import {ActionFactory} from "@shared/types/actions/action-factory";
import {Flex} from "@ui/flex";

export const UserMenu: FC = () => {
    const {availableActions} = useAppContext();

    return (
        <Flex
            position="fixed"
            bottom={0}
            zIndex={100}
            py={10}
            w="80vw"
            justify="center"
        >
            {ActionFactory.getFirstAvailableAction(availableActions)?.buttonNode()}
        </Flex>
    )
}