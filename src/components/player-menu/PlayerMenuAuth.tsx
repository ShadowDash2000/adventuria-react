import { VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { DialogButton as RollItemsDialogButton } from '@components/actions/items/DialogButton';
import { RadioButton } from '@components/radio/RadioButton';
import { useAppAuthContext } from '@context/AppContext';
import { VolumeButton } from '@components/player-menu/VolumeButton';
import { PlayerBalance } from '@components/player-menu/PlayerBalance';
import { PlayerDrops } from '@components/player-menu/PlayerDrops';
import { Energy } from '@components/player-menu/Energy';

export const PlayerMenuAuth = () => {
    const { playerId } = useAppAuthContext();

    return (
        <>
            <VStack
                position="fixed"
                w="3.5rem"
                left={0}
                bottom={0}
                pl={4}
                mb={10}
                zIndex={100}
                align="left"
            >
                <PlayerDrops />
                <Energy />
                <PlayerBalance />
                <VStack justify="center" align="start">
                    <PlayerInventoryButton playerId={playerId} kbd={true} />
                    <RollItemsDialogButton />
                    <RadioButton />
                    <VolumeButton />
                </VStack>
            </VStack>
        </>
    );
};
