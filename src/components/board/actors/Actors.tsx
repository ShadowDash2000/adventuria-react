import { For } from '@chakra-ui/react';
import { Actor } from './Actor';
import { useBoardInnerContext } from '@components/board';

export const Actors = () => {
    const { activeActors } = useBoardInnerContext();

    return (
        <For each={activeActors}>
            {actor => (
                <Actor
                    id={actor.id}
                    kind={actor.kind}
                    name={actor.name}
                    avatar={actor.avatar}
                    color={actor.color}
                    currenWorld={actor.current_world}
                    cellsPassed={actor.cells_passed}
                    updated={new Date(actor.updated).getTime()}
                    key={actor.id}
                    zIndex={13}
                />
            )}
        </For>
    );
};
