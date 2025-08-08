import {UserAction} from "./UserAction";
import {For} from "@chakra-ui/react";
import {useCollectionListInfinite} from "@context/CollectionListInfiniteContext";
import {ActionRecord} from "@shared/types/action";

export const UserActionsList = () => {
    const {data: actions} = useCollectionListInfinite<ActionRecord>();

    if (!actions) {
        return (
            <>
                No actions.
            </>
        )
    }

    return (
        <For each={actions.pages}>
            {(list) => (
                list.items.map((action) => (
                    <UserAction key={action.id} action={action}/>
                ))
            )}
        </For>
    )
}