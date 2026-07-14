import { HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { LuBatteryFull } from 'react-icons/lu';

export const Energy = () => {
    const { playerProgress, isPlayerProgressSuccess } = useAppAuthContext();

    return (
        <Tooltip content="Очки энергии">
            <HStack justifyContent="center" w="full">
                <Text userSelect="none">
                    {isPlayerProgressSuccess ? playerProgress.energy : <Spinner />}
                </Text>
                <Icon size="lg">
                    <LuBatteryFull />
                </Icon>
            </HStack>
        </Tooltip>
    );
};
