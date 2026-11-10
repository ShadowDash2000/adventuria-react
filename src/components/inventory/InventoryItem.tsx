import { useEffect, useState } from 'react';
import { Card } from '@chakra-ui/react';
import { UseItemButton } from './UseItemButton';
import { DropItemButton } from './DropItemButton';
import { ItemIcon } from '@components/items/ItemIcon';
import type { PlayerInventoryItemView } from '@components/inventory/Inventory';

interface InventoryItemProps {
    item: PlayerInventoryItemView;
    showControlButtons?: boolean;
}

export const InventoryItem = ({ item, showControlButtons = false }: InventoryItemProps) => {
    const [isActive, setIsActive] = useState<boolean>(item.is_active);

    useEffect(() => {
        setIsActive(item.is_active);
    }, [item.is_active]);

    return (
        <Card.Root>
            <Card.Body alignItems="center" gap={2}>
                <ItemIcon itemId={item.item_id} description={item.description} src={item.icon} />
                <Card.Title mt="2">{item.name}</Card.Title>
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <DropItemButton
                            canDrop={item.can_drop && !isActive}
                            inventoryId={item.inventory_id}
                            dropPrice={item.drop_price}
                        />
                        <UseItemButton
                            canUse={!isActive && item.can_use}
                            inventoryId={item.inventory_id}
                            itemEffects={item.unapplied_effects}
                            onItemUse={() => setIsActive(true)}
                        />
                    </>
                )}
            </Card.Footer>
        </Card.Root>
    );
};
