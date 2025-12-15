import { For } from '@chakra-ui/react';
import { Player } from './Player';
import { useBoardInnerContext } from '@components/board';

export const Players = () => {
    const { users } = useBoardInnerContext();

    return (
        <For each={[...users.entries()]}>
            {([id, user]) => <Player user={user} key={id} zIndex={10} pointerEvents="none" />}
        </For>
    );
};
