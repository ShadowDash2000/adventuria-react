import { HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { EnergyIcon } from '@shared/components/EnergyIcon';

export const Energy = () => {
    const { playerProgress, isPlayerProgressSuccess } = useAppAuthContext();

    return (
        <Tooltip content="Очки энергии">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">
                    {isPlayerProgressSuccess ? playerProgress.energy : <Spinner />}
                </Text>
                <Icon size="lg">
                    <EnergyIcon />
                </Icon>
            </HStack>
        </Tooltip>
    );
};
