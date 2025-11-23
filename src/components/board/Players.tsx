import {For} from "@chakra-ui/react";
import {Player} from "./Player";
import {useBoardContext} from "./Board";

export const Players = () => {
    const {users} = useBoardContext();

    return (
        <For each={[...users.entries()]}>
            {([id, user]) => (
                <Player user={user} key={id}/>
            )}
        </For>
    )
}