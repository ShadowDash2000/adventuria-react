import { HStack, VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { ItemsWheelModal } from '@components/actions/roll-wheel/items-wheel/ItemsWheelModal';
import { RadioButton } from '@components/radio/RadioButton';
import { useAppAuthContext } from '@context/AppContext';
import { Timer } from '@components/timer/Timer';
import { VolumeButton } from '@components/user-menu/VolumeButton';
import { UserBalance } from '@components/user-menu/UserBalance';

export const UserMenuAuth = () => {
    const { user } = useAppAuthContext();

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
                <UserBalance />
                <VStack justify="center" align="start">
                    <PlayerInventoryButton user={user} kbd={true} />
                    <ItemsWheelModal />
                    <RadioButton />
                    <VolumeButton />
                </VStack>
            </VStack>
            <HStack
                position="fixed"
                right={0}
                top={0}
                pr={4}
                mt={10}
                zIndex={100}
                justify="center"
                align="center"
            >
                <Timer userId={user.id} />
            </HStack>
        </>
    );
};
