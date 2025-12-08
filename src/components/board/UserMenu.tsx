import { type FC } from 'react';
import { HStack, Icon, Text } from '@chakra-ui/react';
import { PlayerInventoryButton } from './inventory/PlayerInventoryButton';
import { Tooltip } from '@ui/tooltip';
import { ItemsWheelModal } from './actions/roll-wheel/ItemsWheelModal';
import { RadioPlayerButton } from './RadioPlayerButton';
import { PiCoinVerticalFill } from 'react-icons/pi';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';

export const UserMenu: FC = () => {
    const { user } = useAppContext();

    return (
        <>
            <HStack
                position="fixed"
                left={0}
                bottom={0}
                pl={4}
                pb={10}
                zIndex={100}
                justify="center"
                align="start"
            >
                <PlayerInventoryButton userId={user?.id!} />
                <ItemsWheelModal />
                <RadioPlayerButton />
            </HStack>
            <HStack
                position="fixed"
                right={0}
                bottom={0}
                pr={4}
                pb={10}
                zIndex={100}
                justify="center"
                align="center"
            >
                <Tooltip content="Баланс">
                    <HStack>
                        <Text fontSize="3rem" userSelect="none">
                            {user.balance}
                        </Text>
                        <Icon w="4rem" h="4rem" color="yellow.400">
                            <PiCoinVerticalFill />
                        </Icon>
                    </HStack>
                </Tooltip>
            </HStack>
        </>
    );
};
