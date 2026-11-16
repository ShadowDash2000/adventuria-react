import { For } from '@chakra-ui/react';
import { Actor } from './Actor';
import { useBoardInnerContext } from '@components/board';

export const Actors = () => {
    const { activeActors } = useBoardInnerContext();

    return (
        <For each={activeActors}>
            {actor => <Actor actor={actor} key={actor.id} zIndex={13} zIndexHighlight={23} />}
        </For>
    );
};
