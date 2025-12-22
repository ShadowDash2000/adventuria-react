import { useEffect, useState } from 'react';
import { Card, CloseButton, Dialog, Flex, Image, Portal } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { EffectFactory, Type_Effect_Creator } from '@components/inventory/effects/effect-factory';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { RecordIdString } from '@shared/types/pocketbase';
import { useKbdSettingsStore } from '@shared/hook/useKbdSettings';
import { Tooltip } from '@ui/tooltip';
import parse from 'html-react-parser';
import { invalidateAllActions } from '@shared/queryClient';
import { Button } from '@theme/button';

interface InventoryItemProps {
    invItem: InventoryItemRecord;
    showControlButtons?: boolean;
}

export const InventoryItem = ({ invItem, showControlButtons = false }: InventoryItemProps) => {
    const { pb } = useAppContext();
    const setKbdBlocked = useKbdSettingsStore(state => state.setBlockedAll);
    const [isActive, setIsActive] = useState<boolean>(invItem.isActive);
    const item = invItem.expand!.item;
    const icon = pb.files.getURL(item, item.icon);

    useEffect(() => {
        setIsActive(invItem.isActive);
    }, [invItem.isActive]);

    const handleSubmit = async (formData: FormData) => {
        try {
            await itemUseRequest(pb.authStore.token, invItem.id, Object.fromEntries(formData));
            setIsActive(true);
            setKbdBlocked(false);
            await invalidateAllActions();
        } catch (e) {
            console.error(e);
        }
    };

    const effects =
        item.expand?.effects.entries()!.reduce((prev, [, effect]) => {
            const effectFactory = EffectFactory.get(effect.type);
            if (effectFactory === null) return prev;
            return [...prev, effectFactory];
        }, [] as Type_Effect_Creator[]) || [];

    const needModal = effects.length > 0;

    return (
        <Card.Root>
            <Card.Body gap="2">
                <Tooltip
                    content={parse(item.description)}
                    contentProps={{ fontSize: 'lg' }}
                    disabled={!item.description}
                    openDelay={100}
                >
                    <Image src={icon} width="100%" height="100%" />
                </Tooltip>
                <Card.Title mt="2">{item.name}</Card.Title>
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <Button colorPalette="red">Выбросить</Button>
                        {needModal && !isActive ? (
                            <Dialog.Root
                                lazyMount
                                unmountOnExit
                                onOpenChange={e => setKbdBlocked(e.open)}
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
                                disabled={isActive}
                                colorPalette="green"
                                onClick={async () => {
                                    try {
                                        await itemUseRequest(pb.authStore.token, invItem.id);
                                        setIsActive(true);
                                        await invalidateAllActions();
                                    } catch (e) {
                                        console.error(e);
                                    }
                                }}
                            >
                                Использовать
                            </Button>
                        )}
                    </>
                )}
            </Card.Footer>
        </Card.Root>
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
