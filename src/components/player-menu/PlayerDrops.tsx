import { HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { GiSkullCrack } from 'react-icons/gi';

export const PlayerDrops = () => {
    const { gameState, isGameStateSuccess, isGameStateError } = useAppAuthContext();

    if (isGameStateError) {
        return null;
    }

    return (
        <Tooltip content="Счётчик дропов">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">
                    {isGameStateSuccess ? gameState.drops_in_a_row : <Spinner />}
                </Text>
                <Icon size="lg">
                    <GiSkullCrack />
                </Icon>
            </HStack>
        </Tooltip>
    );
};
