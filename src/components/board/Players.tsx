import {For} from "@chakra-ui/react";
import {Player} from "./Player";
import {useBoardContext} from "./Board";

export const Players = () => {
    const {users} = useBoardContext();

    return (
        <For each={users}>
            {(user, index) => (
                <Player user={user} key={index}/>
            )}
        </For>
    )
}