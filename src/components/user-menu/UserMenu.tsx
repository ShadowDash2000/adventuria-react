import { HStack, Text, VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from '@components/inventory/PlayerInventoryButton';
import { Tooltip } from '@ui/tooltip';
import { ItemsWheelModal } from '@components/actions/roll-wheel/items-wheel/ItemsWheelModal';
import { RadioButton } from '@components/radio/RadioButton';
import { useAppAuthContext } from '@context/AppContext';
import { Timer } from '@components/timer/Timer';
import { Coin } from '@shared/components/Coin';
import { VolumeButton } from '@components/user-menu/VolumeButton';

export const UserMenu = () => {
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
                <Tooltip content="Баланс">
                    <HStack>
                        <Text userSelect="none">{user.balance}</Text>
                        <Coin w={6} />
                    </HStack>
                </Tooltip>
                <VStack justify="center" align="start">
                    <PlayerInventoryButton userId={user?.id} kbd={true} />
                    <ItemsWheelModal />
                    <RadioButton />
                    <VolumeButton />
                </VStack>
            </VStack>
            <HStack
                position="fixed"
                right={0}
                bottom={0}
                pr={4}
                mb={10}
                zIndex={100}
                justify="center"
                align="center"
            >
                <Timer userId={user.id} />
            </HStack>
        </>
    );
};
