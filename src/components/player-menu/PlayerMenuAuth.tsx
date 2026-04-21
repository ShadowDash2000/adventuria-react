import { VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { ItemsWheelModal } from '@components/actions/roll-wheel/items-wheel/ItemsWheelModal';
import { RadioButton } from '@components/radio/RadioButton';
import { useAppAuthContext } from '@context/AppContext';
import { VolumeButton } from '@components/player-menu/VolumeButton';
import { PlayerBalance } from '@components/player-menu/PlayerBalance';
import { PlayerDrops } from '@components/player-menu/PlayerDrops';

export const PlayerMenuAuth = () => {
    const { player } = useAppAuthContext();

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
                <PlayerBalance />
                <VStack justify="center" align="start">
                    <PlayerInventoryButton player={player} kbd={true} />
                    <ItemsWheelModal />
                    <RadioButton />
                    <VolumeButton />
                </VStack>
            </VStack>
        </>
    );
};
