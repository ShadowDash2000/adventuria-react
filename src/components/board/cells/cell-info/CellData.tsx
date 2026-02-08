import type { CellRecord } from '@shared/types/cell';
import { Coin } from '@shared/components/Coin';
import { DataList, Grid, GridItem, Image, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { useAppContext } from '@context/AppContext';

interface CellDataProps {
    cell: CellRecord;
}

export const CellData = ({ cell }: CellDataProps) => {
    const { pb } = useAppContext();

    const hasActivityFilter = !!(
        cell.expand?.filter?.expand?.activities && cell.expand.filter.expand.activities.length > 0
    );
    const activities = hasActivityFilter ? cell.expand!.filter!.expand!.activities : [];

    return (
        <>
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
            {activities && activities.length > 0 && (
                <>
                    <Text>Пул игр</Text>
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
                </>
            )}
        </>
    );
};
