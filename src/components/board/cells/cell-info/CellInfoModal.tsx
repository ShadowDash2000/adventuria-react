import { Dialog, Portal, CloseButton, Flex, Spinner, Text } from '@chakra-ui/react';
import { CellInfo } from './CellInfo';
import type { CSSProperties, ReactNode } from 'react';
import { useCellsStore } from '@components/board/useCellsStore';
import { useQuery } from '@tanstack/react-query';
import { cellDetailedQueryOptions } from '@shared/query/requests';

type CellInfoProps = { children?: ReactNode };

export const CellInfoModal = ({ children }: CellInfoProps) => {
    const { selectedCellId, isModalOpen, closeCellInfo } = useCellsStore();

    const cell = useQuery({
        ...cellDetailedQueryOptions(selectedCellId || ''),
        enabled: isModalOpen,
        refetchOnWindowFocus: false,
    });

    return (
        <Dialog.Root
            variant="cell"
            size="xl"
            open={isModalOpen}
            onOpenChange={e => !e.open && closeCellInfo()}
            scrollBehavior="inside"
            lazyMount
            unmountOnExit
        >
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop></Dialog.Backdrop>
                <Dialog.Positioner>
                    <Dialog.Content
                        style={{ '--dialog-cell-accent': cell.data?.color } as CSSProperties}
                    >
                        {(cell.isPending || cell.isFetching) && (
                            <Flex justify="center" p={6}>
                                <Spinner />
                            </Flex>
                        )}
                        {cell.isError && <Text>Error: {cell.error.message}</Text>}
                        {cell.isSuccess && <CellInfo cell={cell.data} />}
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
