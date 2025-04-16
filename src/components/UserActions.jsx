import {Action} from "./Action.jsx";
import {For} from "@chakra-ui/react";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useAppContext} from "../context/AppContextProvider.jsx";
import {Suspense} from "react";
import {useUserByLogin} from "../pocketbase/users.js";
import {LuLoader} from "react-icons/lu";

export const UserActions = ({login}) => {
    const {pb} = useAppContext();
    const {user} = useUserByLogin(login);

    const {data: actions} = useSuspenseQuery({
        queryFn: async () => {
            const actions = await pb.collection('actions').getList(1, 50, {
                sort: '-created',
                filter: `user = "${user?.id}"`,
            });
            return actions?.items;
        },
        queryKey: ['actions', user?.id],
    });

    if (!actions) {
        return (
            <>
                No actions.
            </>
        )
    }

    return (
        <Suspense fallback={<LuLoader/>}>
            <For each={actions}>
                {(action, index) => (
                    <Action key={index} action={action}/>
                )}
            </For>
        </Suspense>
    )
}