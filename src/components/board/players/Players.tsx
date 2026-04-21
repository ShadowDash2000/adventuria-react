import { For } from '@chakra-ui/react';
import { Player } from './Player';
import { useBoardInnerContext } from '@components/board';

export const Players = () => {
    const { players, playersProgress } = useBoardInnerContext();

    const playersWithProgress = [...players.entries()].flatMap(([id, player]) => {
        const playerProgress = playersProgress.get(id);
        return playerProgress ? [{ player, playerProgress }] : [];
    });

    return (
        <For each={playersWithProgress}>
            {({ player, playerProgress }) => (
                <Player
                    player={player}
                    playerProgress={playerProgress}
                    key={player.id}
                    zIndex={10}
                    pointerEvents="none"
                />
            )}
        </For>
    );
};
