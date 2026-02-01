import { useEffect, useState } from 'react';
import { Card } from '@chakra-ui/react';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { UseItemButton } from './UseItemButton';
import { DropItemButton } from './DropItemButton';
import { ItemIcon } from '@components/items/ItemIcon';

interface InventoryItemProps {
    invItem: InventoryItemRecord;
    showControlButtons?: boolean;
}

export const InventoryItem = ({ invItem, showControlButtons = false }: InventoryItemProps) => {
    const [isActive, setIsActive] = useState<boolean>(invItem.isActive);
    const item = invItem.expand!.item;

    useEffect(() => {
        setIsActive(invItem.isActive);
    }, [invItem.isActive]);

    return (
        <Card.Root>
            <Card.Body alignItems="center" gap={2}>
                <ItemIcon item={item} />
                <Card.Title mt="2">{item.name}</Card.Title>
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <DropItemButton canDrop={item.canDrop} invItem={invItem} />
                        <UseItemButton
                            canUse={!isActive && invItem.can_use}
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
