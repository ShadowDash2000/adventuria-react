import { HStack, Text, VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from './inventory/PlayerInventoryButton';
import { Tooltip } from '@ui/tooltip';
import { ItemsWheelModal } from '@components/actions/roll-wheel/items-wheel/ItemsWheelModal';
import { RadioButton } from '@components/radio/RadioButton';
import { useAppAuthContext } from '@context/AppContext';
import { Timer } from '@components/timer/Timer';
import { Coin } from '@shared/components/Coin';

export const UserMenu = () => {
    const { user } = useAppAuthContext();

    return (
        <>
            <VStack position="fixed" left={0} bottom={0} pl={4} mb={10} zIndex={100} align="center">
                <Tooltip content="Баланс">
                    <HStack>
                        <Text userSelect="none">{user.balance}</Text>
                        <Coin w={6} />
                    </HStack>
                </Tooltip>
                <HStack justify="center" align="start">
                    <PlayerInventoryButton userId={user?.id} kbd={true} />
                    <ItemsWheelModal />
                    <RadioButton />
                </HStack>
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
