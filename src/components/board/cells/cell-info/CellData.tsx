import { Coin } from '@shared/components/Coin';
import { DataList, Grid, GridItem, Icon, Text } from '@chakra-ui/react';
import { Tooltip } from '@ui/tooltip';
import { Cover } from '@components/activities/Cover';
import { EnergyIcon } from '@shared/components/EnergyIcon';
import type { CellDetailed } from '@shared/query/requests/cell-detailed';

interface CellDataProps {
    cell: CellDetailed;
}

const activityListTitle: Record<string, string> = {
    game: 'Пул игр',
    movie: 'Пул фильмов',
    gym: 'Пул тренировок',
    karaoke: 'Пул песен',
};

export const CellData = ({ cell }: CellDataProps) => {
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
                <DataList.Item>
                    <DataList.ItemLabel>Энергии для завершения</DataList.ItemLabel>
                    <DataList.ItemValue display="flex" alignItems="center" gap={2}>
                        {cell.done_energy_consume}{' '}
                        <Icon size="lg">
                            <EnergyIcon />
                        </Icon>
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Энергии для дропа</DataList.ItemLabel>
                    <DataList.ItemValue display="flex" alignItems="center" gap={2}>
                        {cell.drop_energy_consume}{' '}
                        <Icon size="lg">
                            <EnergyIcon />
                        </Icon>
                    </DataList.ItemValue>
                </DataList.Item>
                {cell.activity_filter && (
                    <>
                        {cell.activity_filter.platforms.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Платформы</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.platforms
                                        .map(item => item.name)
                                        .join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.developers.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Разработчики</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.developers
                                        .map(item => item.name)
                                        .join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.publishers.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Издатели</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.publishers
                                        .map(item => item.name)
                                        .join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.genres.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Жанры</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.genres.map(item => item.name).join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.tags.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Теги</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.tags.map(item => item.name).join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.themes.length > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Темы</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.themes.map(item => item.name).join(', ')}
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.min_campaign_time > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Мин. время</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.min_campaign_time} ч.
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.activity_filter.max_campaign_time > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Макс. время</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.activity_filter.max_campaign_time} ч.
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                        {cell.average_campaign_time > 0 && (
                            <DataList.Item>
                                <DataList.ItemLabel>Среднее время</DataList.ItemLabel>
                                <DataList.ItemValue>
                                    {cell.average_campaign_time.toFixed(1)} ч.
                                </DataList.ItemValue>
                            </DataList.Item>
                        )}
                    </>
                )}
            </DataList.Root>
            {cell.activity_filter?.activities && cell.activity_filter.activities.length > 0 && (
                <>
                    <Text>{activityListTitle[cell.type] || 'Пул'}</Text>
                    <Grid templateColumns="repeat(3, 1fr)" gap={2}>
                        {cell.activity_filter.activities.map(activity => (
                            <GridItem key={activity.id} display="flex" flexDir="column">
                                <Tooltip
                                    content={`Время прохождения: ${activity.hltb_campaign_time} ч.`}
                                    disabled={activity.hltb_campaign_time <= 0}
                                    openDelay={100}
                                >
                                    <Cover
                                        coverUrl={activity.cover}
                                        coverAltUrl={activity.cover_alt}
                                        width="100%"
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
