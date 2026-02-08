import { useAppContext } from '@context/AppContext';
import HTMLReactParser from 'html-react-parser';
import { Blockquote, Spinner, Text, Image, Dialog, Flex, HStack, VStack } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import type { CellRecord } from '@shared/types/cell';
import { CellData } from '@components/board/cells/cell-info/CellData';

interface CellInfoProps {
    cellId: RecordIdString;
}

export const CellInfo = ({ cellId }: CellInfoProps) => {
    const { pb } = useAppContext();

    const {
        data: cell,
        isPending,
        isError,
        error,
    } = useQuery({
        queryFn: () =>
            pb
                .collection('cells')
                .getOne<CellRecord>(cellId, {
                    expand:
                        'filter.platforms,filter.developers,filter.publishers,' +
                        'filter.genres,filter.tags,filter.themes,filter.activities',
                }),
        queryKey: queryKeys.cell(cellId),
        refetchOnWindowFocus: false,
    });

    if (isPending) {
        return (
            <Flex justify="center" p={6}>
                <Spinner />
            </Flex>
        );
    }

    if (isError) {
        const e = error as ClientResponseError;
        return <Text>Error: {e.message}</Text>;
    }

    return (
        <>
            <Dialog.Header>
                <Dialog.Title>{cell.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" overflow="hidden">
                <HStack overflow="hidden auto" alignItems="flex-start">
                    <VStack flex={1}>
                        <CellData cell={cell} />
                    </VStack>
                    <VStack flex={1} alignItems="flex-start">
                        <Image src={pb.files.getURL(cell, cell.icon)} width="100%" height="100%" />
                        <Blockquote.Root variant="solid">
                            <Blockquote.Content>
                                {HTMLReactParser(cell.description)}
                            </Blockquote.Content>
                        </Blockquote.Root>
                    </VStack>
                </HStack>
            </Dialog.Body>
        </>
    );
};
