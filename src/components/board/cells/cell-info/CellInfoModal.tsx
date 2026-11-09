import { Dialog, Portal, CloseButton, Flex, Spinner, Text } from '@chakra-ui/react';
import { CellInfo } from './CellInfo';
import type { CSSProperties, ReactNode } from 'react';
import type { CellRecord } from '@shared/types/cell';
import { dotExpand, joinExpand } from '@shared/pbExpand';
import { activityFilterSchema, cellSchema, pbCollections } from '@/shared/pbSchema';
import { queryKeys } from '@shared/query';
import { useCellsStore } from '@components/board/useCellsStore';
import { useQuery } from '@tanstack/react-query';
import { useAppContext } from '@context/AppContext';

type CellInfoProps = { children?: ReactNode };

export const CellInfoModal = ({ children }: CellInfoProps) => {
    const { pb } = useAppContext();
    const { selectedCellId, isModalOpen, closeCellInfo } = useCellsStore();

    const cell = useQuery({
        queryFn: async () => {
            if (!selectedCellId) {
                throw new Error('No cell selected');
            }

            const result = await pb
                .collection(pbCollections.cells)
                .getOne<CellRecord>(selectedCellId, {
                    expand: joinExpand(
                        dotExpand(cellSchema.filter, activityFilterSchema.platforms),
                        dotExpand(cellSchema.filter, activityFilterSchema.developers),
                        dotExpand(cellSchema.filter, activityFilterSchema.publishers),
                        dotExpand(cellSchema.filter, activityFilterSchema.genres),
                        dotExpand(cellSchema.filter, activityFilterSchema.tags),
                        dotExpand(cellSchema.filter, activityFilterSchema.themes),
                        dotExpand(cellSchema.filter, activityFilterSchema.activities),
                    ),
                });

            if (result.expand?.filter?.expand?.activities) {
                result.expand.filter.expand.activities =
                    result.expand?.filter?.expand?.activities.map(activity => ({
                        ...activity,
                        cover_alt: activity.cover_alt
                            ? pb.files.getURL(activity, activity.cover_alt)
                            : '',
                    }));
            }

            return result;
        },
        enabled: isModalOpen,
        queryKey: queryKeys.cell(selectedCellId || ''),
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
