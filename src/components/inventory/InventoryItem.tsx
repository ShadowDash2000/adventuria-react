import { useEffect, useState } from 'react';
import { Card, CloseButton, Dialog, Flex, Image, Portal } from '@chakra-ui/react';
import { Button } from '@ui/button';
import { useAppContext } from '@context/AppContextProvider';
import { EffectFactory, Type_Effect_Creator } from '@components/inventory/effects/effect-factory';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { RecordIdString } from '@shared/types/pocketbase';
import { DialogContent } from '@ui/dialog-content';

interface InventoryItemProps {
    invItem: InventoryItemRecord;
    showControlButtons?: boolean;
}

export const InventoryItem = ({ invItem, showControlButtons = false }: InventoryItemProps) => {
    const { pb } = useAppContext();
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
        } catch (_) {}
    };

    const effects =
        item.expand?.effects.entries()!.reduce((prev, [_, effect]) => {
            const effectFactory = EffectFactory.get(effect.type);
            if (effectFactory === null) return prev;
            return [...prev, effectFactory];
        }, [] as Type_Effect_Creator[]) || [];

    const needModal = effects.length > 0;

    return (
        <Card.Root>
            <Card.Body gap="2">
                <Image src={icon} width="100%" height="100%" />
                <Card.Title mt="2">{item.name}</Card.Title>
                <Card.Description dangerouslySetInnerHTML={{ __html: item.description }} minH={5} />
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <Button colorPalette="red">Выбросить</Button>
                        {needModal && !isActive ? (
                            <Dialog.Root lazyMount unmountOnExit>
                                <Dialog.Trigger asChild>
                                    <Button colorPalette="green">Использовать</Button>
                                </Dialog.Trigger>
                                <Portal>
                                    <Dialog.Backdrop></Dialog.Backdrop>
                                    <Dialog.Positioner>
                                        <DialogContent>
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
                                        </DialogContent>
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
                                    } catch (_) {}
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
    data?: Record<string, any>,
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
