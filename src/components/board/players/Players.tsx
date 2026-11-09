import { For } from '@chakra-ui/react';
import { Player } from './Player';
import { useBoardInnerContext } from '@components/board';

export const Players = () => {
    const { activePlayers } = useBoardInnerContext();

    return (
        <For each={activePlayers}>
            {player => (
                <Player
                    playerId={player.id}
                    playerName={player.name}
                    avatar={player.avatar}
                    color={player.color}
                    currenWorld={player.progress.current_world}
                    cellsPassed={player.progress.cells_passed}
                    updated={new Date(player.progress.updated).getTime()}
                    key={player.id}
                    zIndex={13}
                />
            )}
        </For>
    );
};
