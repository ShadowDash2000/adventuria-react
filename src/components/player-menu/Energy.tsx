import { HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { EnergyIcon } from '@shared/components/EnergyIcon';

export const Energy = () => {
    const { gameState, isGameStateSuccess, isGameStateError } = useAppAuthContext();

    if (isGameStateError) {
        return null;
    }

    return (
        <Tooltip content="Очки энергии">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">{isGameStateSuccess ? gameState.energy : <Spinner />}</Text>
                <Icon size="lg">
                    <EnergyIcon />
                </Icon>
            </HStack>
        </Tooltip>
    );
};
