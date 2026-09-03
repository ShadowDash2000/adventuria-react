import { useEffect, useState } from 'react';
import { Card } from '@chakra-ui/react';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { UseItemButton } from './UseItemButton';
import { DropItemButton } from './DropItemButton';
import { ItemIcon } from '@components/items/ItemIcon';
import { useAppContext } from '@context/AppContext';

interface InventoryItemProps {
    invItem: InventoryItemRecord;
    showControlButtons?: boolean;
}

export const InventoryItem = ({ invItem, showControlButtons = false }: InventoryItemProps) => {
    const { pb } = useAppContext();
    const [isActive, setIsActive] = useState<boolean>(invItem.is_active);
    const item = invItem.expand!.item;

    useEffect(() => {
        setIsActive(invItem.is_active);
    }, [invItem.is_active]);

    return (
        <Card.Root>
            <Card.Body alignItems="center" gap={2}>
                <ItemIcon
                    itemId={item.id}
                    description={item.description}
                    src={pb.files.getURL(item, item.icon)}
                />
                <Card.Title mt="2">{item.name}</Card.Title>
            </Card.Body>
            <Card.Footer flexDirection="column">
                {showControlButtons && (
                    <>
                        <DropItemButton canDrop={invItem.can_drop && !isActive} invItem={invItem} />
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
