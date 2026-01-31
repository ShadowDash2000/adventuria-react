import { CloseButton, Dialog, HStack, Image, Portal, Text } from '@chakra-ui/react';
import { useAppContext } from '@context/AppContext';
import { Tooltip } from '@ui/tooltip';
import parse from 'html-react-parser';
import type { ReactNode } from 'react';
import { type ItemRecord, ItemTypeInfo } from '@shared/types/item';
import { Coin } from '@shared/components/Coin';

interface GlossaryItemDetailModalProps {
    item: ItemRecord;
    children: ReactNode;
}

export const GlossaryItemDetailModal = ({ item, children }: GlossaryItemDetailModalProps) => {
    const { pb } = useAppContext();
    const icon = pb.files.getURL(item, item.icon);

    return (
        <Dialog.Root size="sm" scrollBehavior="inside" lazyMount unmountOnExit>
            <Tooltip
                content={parse(item.description)}
                contentProps={{ fontSize: 'lg' }}
                disabled={!item.description}
                openDelay={100}
            >
                <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            </Tooltip>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Text>{item.name}</Text>
                                <Text color={ItemTypeInfo[item.type].color}>
                                    ({ItemTypeInfo[item.type].label})
                                </Text>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display="flex" flexDir="column" alignItems="center" gap={4}>
                            <Image src={icon} width="100%" height="100%" />
                            <HStack>
                                <Text userSelect="none">
                                    {item.price > 0 ? item.price : 'Не продается'}
                                </Text>
                                <Coin w={6} />
                            </HStack>
                            <Text>{parse(item.description)}</Text>
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
