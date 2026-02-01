import { useAppContext } from '@context/AppContext';
import HTMLReactParser from 'html-react-parser';
import {
    Blockquote,
    DataList,
    Grid,
    GridItem,
    Spinner,
    Stack,
    Text,
    Image,
    Dialog,
    Flex,
} from '@chakra-ui/react';
import { Coin } from '@shared/components/Coin';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@shared/queryClient';
import type { RecordIdString } from '@shared/types/pocketbase';
import type { ClientResponseError } from 'pocketbase';
import type { CellRecord } from '@shared/types/cell';
import { Tooltip } from '@ui/tooltip';

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

    const hasActivityFilter = !!(
        cell.expand?.filter?.expand?.activities && cell.expand.filter.expand.activities.length > 0
    );
    const activities = hasActivityFilter ? cell.expand!.filter!.expand!.activities : [];

    return (
        <>
            <Dialog.Header>
                <Dialog.Title>{cell.name}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body display="flex" overflow="hidden">
                <Stack overflow="hidden auto">
                    <DataList.Root orientation="horizontal">
                        <DataList.Item>
                            <DataList.ItemLabel>Очков за клетку</DataList.ItemLabel>
                            <DataList.ItemValue>{cell.points}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item>
                            <DataList.ItemLabel>Монет за клетку</DataList.ItemLabel>
                            <DataList.ItemValue display="flex" alignItems="center" gap={2}>
                                {cell.coins} <Coin w={6} />
                            </DataList.ItemValue>
                        </DataList.Item>
                        {cell.expand?.filter && (
                            <>
                                {cell.expand.filter.expand?.platforms && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Платформы</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.platforms
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.expand?.developers && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Разработчики</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.developers
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.expand?.publishers && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Издатели</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.publishers
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.expand?.genres && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Жанры</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.genres
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.expand?.tags && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Теги</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.tags
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.expand?.themes && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Темы</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.expand.themes
                                                .map(item => item.name)
                                                .join(', ')}
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.min_campaign_time > 0 && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Мин. время</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.min_campaign_time} ч.
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                                {cell.expand.filter.max_campaign_time > 0 && (
                                    <DataList.Item>
                                        <DataList.ItemLabel>Макс. время</DataList.ItemLabel>
                                        <DataList.ItemValue>
                                            {cell.expand.filter.max_campaign_time} ч.
                                        </DataList.ItemValue>
                                    </DataList.Item>
                                )}
                            </>
                        )}
                    </DataList.Root>
                    <Blockquote.Root variant="solid">
                        <Blockquote.Content>{HTMLReactParser(cell.description)}</Blockquote.Content>
                    </Blockquote.Root>
                    <Image src={pb.files.getURL(cell, cell.icon)} width="100%" height="100%" />
                    {activities && (
                        <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                            {activities.map(activity => (
                                <GridItem key={activity.id} display="flex" flexDir="column">
                                    <Tooltip
                                        content={`Время прохождения: ${activity.hltb_campaign_time} ч.`}
                                        disabled={activity.hltb_campaign_time <= 0}
                                        openDelay={100}
                                    >
                                        <Image
                                            src={
                                                activity.cover ||
                                                pb.files.getURL(activity, activity.cover_alt)
                                            }
                                            width="100%"
                                            aspectRatio="2/3"
                                            objectFit="cover"
                                        />
                                    </Tooltip>
                                    <Text>{activity.name}</Text>
                                </GridItem>
                            ))}
                        </Grid>
                    )}
                </Stack>
            </Dialog.Body>
        </>
    );
};
