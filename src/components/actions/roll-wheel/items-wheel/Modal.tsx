import { LuFerrisWheel } from 'react-icons/lu';
import { CloseButton, Dialog, IconButton, Portal, Spinner } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useEffect, useState } from 'react';
import { useAppAuthContext } from '@context/AppContext';
import { Content } from './Content';
import { useRollWheelStore } from '../useRollWheelStore';
import { useRollDiceStore } from '@components/actions/roll-dice/useRollDiceStore';
import { invalidateAllActions } from '@shared/queryClient';

export const Modal = () => {
    const {
        availableActions,
        gameState,
        isGameStateSuccess,
        isGameStatePending,
        isGameStateError,
    } = useAppAuthContext();
    const [open, setOpen] = useState(false);
    const [wasSpinned, setWasSpinned] = useState(false);
    const isSpinning = useRollWheelStore(state => state.isSpinning);
    const isRolling = useRollDiceStore(state => state.isRolling);

    useEffect(() => {
        if (isSpinning) {
            setWasSpinned(true);
        }
    }, [isSpinning]);

    if (isGameStatePending) {
        return <Spinner />;
    }

    if (!isGameStateSuccess || isGameStateError) {
        return null;
    }

    return (
        <Dialog.Root
            variant="transparent"
            lazyMount
            unmountOnExit
            open={open}
            onOpenChange={async e => {
                if (!isSpinning) {
                    setOpen(e.open);
                    if (!e.open && wasSpinned) {
                        await invalidateAllActions();
                        setWasSpinned(false);
                    }
                }
            }}
            size="full"
        >
            <Tooltip content="Колесо предметов">
                <Dialog.Trigger asChild>
                    <IconButton
                        w="full"
                        flexDir="column"
                        gap={0}
                        disabled={
                            gameState.item_wheels_count === 0 ||
                            !availableActions.includes('roll_item') ||
                            isSpinning ||
                            isRolling
                        }
                        colorPalette="{colors.purple}"
                        _hover={{ bg: '{colors.purple.hover}' }}
                    >
                        <LuFerrisWheel />x{gameState.item_wheels_count}
                    </IconButton>
                </Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop bg="blackAlpha.300" backdropFilter="blur(0.2vw)" />
                <Dialog.Positioner>
                    <Dialog.Content bg="none" boxShadow="none" mt={0}>
                        <Dialog.Body display="flex" justifyContent="space-around" p={0}>
                            <Content />
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
