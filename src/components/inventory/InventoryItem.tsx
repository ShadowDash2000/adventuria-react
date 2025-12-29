import { useEffect, useState } from 'react';
import { Card, Image } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { UseItemButton } from './UseItemButton';
import { DropItemButton } from './DropItemButton';
import { GlossaryItemDetailModal } from '@components/glossary/GlossaryItemDetailModal';

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

    return (
        <Card.Root>
            <Card.Body alignItems="center" gap={2}>
                <GlossaryItemDetailModal item={item}>
                    <Image src={icon} width="100%" height="100%" _hover={{ cursor: 'pointer' }} />
                </GlossaryItemDetailModal>
                <Card.Title mt="2">{item.name}</Card.Title>
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <DropItemButton invItemId={invItem.id} />
                        <UseItemButton
                            isActive={isActive}
                            canUse={invItem.can_use}
                            invItemId={invItem.id}
                            itemEffects={item.expand!.effects}
                            onItemUse={() => setIsActive(true)}
                        />
                    </>
                )}
            </Card.Footer>
        </Card.Root>
    );
};
