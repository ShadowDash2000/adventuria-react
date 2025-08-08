import {Action} from "./Action";
import {For} from "@chakra-ui/react";
import {useCollectionListInfinite} from "@context/CollectionListInfiniteContext";
import {ActionRecord} from "@shared/types/action";

export const UserActions = () => {
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
                    <Action key={action.id} action={action}/>
                ))
            )}
        </For>
    )
}