import { HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { PlayerInventoryButton } from './inventory/PlayerInventoryButton';
import { Tooltip } from '@ui/tooltip';
import { ItemsWheelModal } from '@components/actions/roll-wheel/ItemsWheelModal';
import { RadioPlayerButton } from './RadioPlayerButton';
import { PiCoinVerticalFill } from 'react-icons/pi';
import { useAppAuthContext } from '@context/AppContext';
import { Timer } from '@components/timer/Timer';

export const UserMenu = () => {
    const { user } = useAppAuthContext();

    return (
        <>
            <VStack position="fixed" left={0} bottom={0} pl={4} mb={10} zIndex={100} align="center">
                <Tooltip content="Баланс">
                    <HStack>
                        <Text userSelect="none">{user.balance}</Text>
                        <Icon size="xl" color="yellow.400">
                            <PiCoinVerticalFill />
                        </Icon>
                    </HStack>
                </Tooltip>
                <HStack justify="center" align="start">
                    <PlayerInventoryButton userId={user?.id} kbd={true} />
                    <ItemsWheelModal />
                    <RadioPlayerButton />
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
