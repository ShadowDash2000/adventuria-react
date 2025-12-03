import { For } from '@chakra-ui/react';
import { Player } from './Player';
import { useBoardInnerContext } from './BoardInner';

export const Players = () => {
    const { users } = useBoardInnerContext();

    return <For each={[...users.entries()]}>{([id, user]) => <Player user={user} key={id} />}</For>;
};
