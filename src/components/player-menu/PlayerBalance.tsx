import { HStack, Spinner, Text } from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';

export const PlayerBalance = () => {
    const { gameState, isGameStateSuccess, isGameStateError } = useAppAuthContext();

    if (isGameStateError) {
        return null;
    }

    return (
        <Tooltip content="Баланс">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">
                    {isGameStateSuccess ? gameState.balance : <Spinner />}
                </Text>
                <Coin w={6} />
            </HStack>
        </Tooltip>
    );
};
