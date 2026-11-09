import { useAppContext } from '@context/AppContext';
import HTMLReactParser from 'html-react-parser';
import { Blockquote, Image, Dialog, HStack, VStack, Heading } from '@chakra-ui/react';
import { CellData } from '@components/board/cells/cell-info/CellData';
import { LatestCompletedActivities } from '@components/board/cells/cell-info/LatestCompletedActivities';
import type { CellRecord } from '@shared/types/cell';

interface CellInfoProps {
    cell: CellRecord;
}

export const CellInfo = ({ cell }: CellInfoProps) => {
    const { pb } = useAppContext();

    return (
        <>
            <Dialog.Header>
                <Dialog.Title>{cell.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" overflow="hidden">
                <HStack w="full" overflow="hidden auto" alignItems="flex-start">
                    <VStack flex={1}>
                        <CellData cell={cell} />
                    </VStack>
                    <VStack flex={1} alignItems="flex-start">
                        <Image src={pb.files.getURL(cell, cell.icon)} width="100%" height="100%" />
                        {cell.cell_event && cell.cell_event.description && (
                            <>
                                <Heading as="h3" size="xl">
                                    Событие на клетке
                                </Heading>
                                <Blockquote.Root variant="solid">
                                    <Blockquote.Content>
                                        {HTMLReactParser(cell.cell_event.description)}
                                    </Blockquote.Content>
                                </Blockquote.Root>
                            </>
                        )}
                        {cell.description && (
                            <>
                                <Heading as="h3" size="xl">
                                    Описание клетки
                                </Heading>
                                <Blockquote.Root variant="solid">
                                    <Blockquote.Content>
                                        {HTMLReactParser(cell.description)}
                                    </Blockquote.Content>
                                </Blockquote.Root>
                            </>
                        )}
                        <LatestCompletedActivities cellId={cell.id} />
                    </VStack>
                </HStack>
            </Dialog.Body>
        </>
    );
};
