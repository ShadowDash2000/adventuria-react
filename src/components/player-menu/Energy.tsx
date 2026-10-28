import { Box, Float, HStack, Icon, IconButton, Spinner, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppAuthContext } from '@context/AppContext';
import { EnergyIcon } from '@shared/components/EnergyIcon';
import { EnergyTimer } from '@components/player-menu/EnergyTimer';
import { LuTimer } from 'react-icons/lu';

export const Energy = () => {
    const { gameState, isGameStateSuccess, isGameStateError } = useAppAuthContext();

    if (isGameStateError) {
        return null;
    }

    return (
        <HStack position="relative" justifyContent="center" w="full">
            <Tooltip content="Очки энергии">
                <HStack>
                    <Text userSelect="none">
                        {isGameStateSuccess ? gameState.energy : <Spinner />}
                    </Text>
                    <Icon size="lg">
                        <EnergyIcon />
                    </Icon>
                </HStack>
            </Tooltip>
            <Tooltip
                content={
                    <Box fontSize="lg">
                        До награды: <EnergyTimer textWrap="nowrap" />
                    </Box>
                }
            >
                <Float pl={2} translate="100% -15%">
                    <IconButton variant="ghost" size="xs">
                        <LuTimer />
                    </IconButton>
                </Float>
            </Tooltip>
        </HStack>
    );
};
