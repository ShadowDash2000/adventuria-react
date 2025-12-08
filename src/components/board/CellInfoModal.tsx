import type { FC, ReactNode } from 'react';
import { Image, Blockquote, Stack, DataList, Dialog, Portal, CloseButton } from '@chakra-ui/react';
import HTMLReactParser from 'html-react-parser';
import { useAppContext } from '@context/AppContextProvider/AppContextProvider';
import type { CellRecord } from '@shared/types/cell';
import { DialogContent } from '@ui/dialog-content';

type CellInfoProps = { cell: CellRecord; children?: ReactNode };

export const CellInfo: FC<CellInfoProps> = ({ cell, children }) => {
    const { pb } = useAppContext();

    return (
        <Dialog.Root lazyMount unmountOnExit>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <DialogContent>
                        <Dialog.Header>
                            <Dialog.Title>{cell.name}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack>
                                <DataList.Root orientation="horizontal">
                                    <DataList.Item>
                                        <DataList.ItemLabel>Очков за клетку</DataList.ItemLabel>
                                        <DataList.ItemValue>{cell.points}</DataList.ItemValue>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.ItemLabel>Монет за клетку</DataList.ItemLabel>
                                        <DataList.ItemValue>{cell.coins}</DataList.ItemValue>
                                    </DataList.Item>
                                </DataList.Root>
                                <Blockquote.Root>
                                    <Blockquote.Content>
                                        {HTMLReactParser(cell.description)}
                                    </Blockquote.Content>
                                </Blockquote.Root>
                                <Image
                                    src={pb.files.getURL(cell, cell.icon)}
                                    width="100%"
                                    height="100%"
                                />
                            </Stack>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </DialogContent>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
