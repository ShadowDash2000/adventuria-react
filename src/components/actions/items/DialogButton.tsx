import { LuFerrisWheel } from 'react-icons/lu';
import { IconButton } from '@chakra-ui/react';
import { useRollWheel, useWheelDialog } from '@components/wheels';
import { useAppAuthContext } from '@context/AppContext';
import { useRollDice } from '@components/dices';

export const DialogButton = () => {
    const {
        availableActions,
        gameState,
        isGameStateSuccess,
        isGameStatePending,
        isGameStateError,
    } = useAppAuthContext();
    const { isSpinning } = useRollWheel();
    const { isRolling } = useRollDice();
    const { openWheel } = useWheelDialog();

    const loading = isGameStatePending;
    const wheelsCount = isGameStateSuccess ? gameState.item_wheels_count : 0;
    const disabled =
        wheelsCount === 0 ||
        !availableActions.includes('roll_item') ||
        isSpinning ||
        isRolling ||
        isGameStateError;

    return (
        <IconButton
            w="full"
            flexDir="column"
            gap={0}
            loading={loading}
            disabled={disabled}
            colorPalette="{colors.purple}"
            _hover={{ bg: '{colors.purple.hover}' }}
            onClick={() => openWheel('items')}
        >
            <LuFerrisWheel />x{wheelsCount}
        </IconButton>
    );
};
