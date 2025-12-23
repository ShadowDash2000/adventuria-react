import { useEffect, useState } from 'react';
import { Card, Image } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import type { InventoryItemRecord } from '@shared/types/inventory-item';
import { Tooltip } from '@ui/tooltip';
import parse from 'html-react-parser';
import { UseItemButton } from './UseItemButton';
import { DropItemButton } from './DropItemButton';

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
                        <DropItemButton invItemId={invItem.id} />
                        <UseItemButton
                            isActive={isActive}
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
