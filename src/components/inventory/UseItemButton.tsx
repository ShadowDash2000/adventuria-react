import { Button } from '@theme/button';
import { useKbdSettingsStore } from '@shared/hook/useKbdSettings';
import {
    invalidateAllActions,
    invalidateGameState,
    invalidatePlayerProgress,
} from '@shared/queryClient';
import { useAppAuthContext } from '@context/AppContext';
import {
    EffectFactory,
    type Type_Effect_Creator,
} from '@components/inventory/effects/effect-factory';
import { CloseButton, Dialog, Flex, Portal } from '@chakra-ui/react';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { EffectRecord } from '@shared/types/effect';
import { useState } from 'react';
import { handleApiResponse } from '@shared/helpers/api';

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
    const { pb, playerId } = useAppAuthContext();
    const incrementKbdBlock = useKbdSettingsStore(state => state.incrementAll);
    const decrementKbdBlock = useKbdSettingsStore(state => state.decrementAll);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        const res = await useItemRequest(
            pb.authStore.token,
            invItemId,
            Object.fromEntries(formData),
        );

        if (!handleApiResponse(res)) {
            return;
        }

        decrementKbdBlock();
        await invalidateAllActions();
        await invalidateGameState();
        await invalidatePlayerProgress(playerId);
        onItemUse?.();
    };

    const handleItemUse = async () => {
        const res = await useItemRequest(pb.authStore.token, invItemId);

        if (!handleApiResponse(res)) {
            return;
        }

        await invalidateAllActions();
        await invalidateGameState();
        await invalidatePlayerProgress(playerId);
        onItemUse?.();
    };

    const effects =
        itemEffects.entries()!.reduce(
            (prev, [, effect]) => {
                const effectFactory = EffectFactory.get(effect.type);
                if (effectFactory === null) return prev;
                return [...prev, { effect: effect, effectCreator: effectFactory }];
            },
            [] as { effect: EffectRecord; effectCreator: Type_Effect_Creator }[],
        ) || [];

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
                                    <form
                                        action={formData => {
                                            setLoading(true);
                                            handleSubmit(formData)
                                                .catch(e => console.error(e))
                                                .finally(() => setLoading(false));
                                        }}
                                    >
                                        {effects.map((effect, i) =>
                                            effect.effectCreator({
                                                invItemId,
                                                effectId: effect.effect.id,
                                                key: i,
                                            }),
                                        )}
                                        <Flex justifyContent="center" pt={5}>
                                            <Button
                                                disabled={loading}
                                                type="submit"
                                                colorPalette="green"
                                            >
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
                    loading={loading}
                    disabled={!canUse}
                    colorPalette="green"
                    onClick={() => {
                        setLoading(true);
                        handleItemUse()
                            .catch(e => console.error(e))
                            .finally(() => setLoading(false));
                    }}
                >
                    Использовать
                </Button>
            )}
        </>
    );
};

type UseItemSuccess = { success: true; message?: string; error?: never };

type UseItemError = { success: false; message: string; error: string };

type UseItemResult = UseItemSuccess | UseItemError;

const useItemRequest = async (
    authToken: string,
    itemId: RecordIdString,
    data?: Record<string, unknown>,
) => {
    const res = await fetch(`${import.meta.env.VITE_PB_URL}/api/use-item`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, data: data }),
    });

    return (await res.json()) as UseItemResult;
};
