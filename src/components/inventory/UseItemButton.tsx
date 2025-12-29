import { Button } from '@theme/button';
import { useKbdSettingsStore } from '@shared/hook/useKbdSettings';
import { invalidateAllActions } from '@shared/queryClient';
import { useAppContext } from '@context/AppContext';
import {
    EffectFactory,
    type Type_Effect_Creator,
} from '@components/inventory/effects/effect-factory';
import { CloseButton, Dialog, Flex, Portal } from '@chakra-ui/react';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { EffectRecord } from '@shared/types/effect';

interface UseItemButtonProps {
    canUse: boolean;
    invItemId: RecordIdString;
    itemEffects: EffectRecord[];
    onItemUse?: () => void;
}

export const UseItemButton = ({
    canUse,
    invItemId,
    itemEffects,
    onItemUse,
}: UseItemButtonProps) => {
    const { pb } = useAppContext();
    const incrementKbdBlock = useKbdSettingsStore(state => state.incrementAll);
    const decrementKbdBlock = useKbdSettingsStore(state => state.decrementAll);

    const handleSubmit = async (formData: FormData) => {
        try {
            await itemUseRequest(pb.authStore.token, invItemId, Object.fromEntries(formData));
            decrementKbdBlock();
            await invalidateAllActions();
            onItemUse?.();
        } catch (e) {
            console.error(e);
        }
    };

    const effects =
        itemEffects.entries()!.reduce((prev, [, effect]) => {
            const effectFactory = EffectFactory.get(effect.type);
            if (effectFactory === null) return prev;
            return [...prev, effectFactory];
        }, [] as Type_Effect_Creator[]) || [];

    const needModal = effects.length > 0;

    return (
        <>
            {needModal && canUse ? (
                <Dialog.Root
                    lazyMount
                    unmountOnExit
                    onOpenChange={e => (e.open ? incrementKbdBlock() : decrementKbdBlock())}
                >
                    <Dialog.Trigger asChild>
                        <Button colorPalette="green">Использовать</Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop></Dialog.Backdrop>
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header />
                                <Dialog.Body>
                                    <form action={handleSubmit}>
                                        {effects.map((effect, i) => effect(i))}
                                        <Flex justifyContent="center" pt={5}>
                                            <Button type="submit" colorPalette="green">
                                                Сохранить
                                            </Button>
                                        </Flex>
                                    </form>
                                </Dialog.Body>
                                <Dialog.CloseTrigger asChild>
                                    <CloseButton size="sm" />
                                </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            ) : (
                <Button
                    disabled={!canUse}
                    colorPalette="green"
                    onClick={async () => {
                        try {
                            await itemUseRequest(pb.authStore.token, invItemId);
                            await invalidateAllActions();
                            onItemUse?.();
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    Использовать
                </Button>
            )}
        </>
    );
};

const itemUseRequest = async (
    authToken: string,
    itemId: RecordIdString,
    data?: Record<string, unknown>,
) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/use-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: itemId, data: data }),
    });
    if (!res.ok) {
        const error = await res
            .json()
            .then(res => res.error)
            .catch(() => '');
        const text = await res.text().catch(() => '');
        throw new Error(error || text || `Failed to use item`);
    }
};
