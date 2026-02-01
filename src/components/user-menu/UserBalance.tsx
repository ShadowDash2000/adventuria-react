import { HStack, Text } from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';

export const UserBalance = () => {
    const { user } = useAppAuthContext();

    return (
        <Tooltip content="Баланс">
            <HStack>
                <Text userSelect="none">{user.balance}</Text>
                <Coin w={6} />
            </HStack>
        </Tooltip>
    );
};
