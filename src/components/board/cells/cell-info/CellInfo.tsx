import HTMLReactParser from 'html-react-parser';
import { Blockquote, Image, Dialog, HStack, VStack, Heading } from '@chakra-ui/react';
import { CellData } from '@components/board/cells/cell-info/CellData';
import { LatestCompletedActivities } from '@components/board/cells/cell-info/LatestCompletedActivities';
import type { CellDetailed } from '@shared/query/requests/cell-detailed';

interface CellInfoProps {
    cell: CellDetailed;
}

export const CellInfo = ({ cell }: CellInfoProps) => {
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
                        <Image src={cell.icon} width="100%" height="100%" />
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
