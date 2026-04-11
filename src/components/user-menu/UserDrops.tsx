import { HStack, Icon, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { GiSkullCrack } from 'react-icons/gi';

export const UserDrops = () => {
    const { user } = useAppAuthContext();

    return (
        <Tooltip content="Счётчик дропов">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">{user.dropsInARow}</Text>
                <Icon size="lg">
                    <GiSkullCrack />
                </Icon>
            </HStack>
        </Tooltip>
    );
};
