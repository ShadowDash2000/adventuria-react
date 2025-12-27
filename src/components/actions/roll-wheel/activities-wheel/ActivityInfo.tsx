import { ActivityRecord, ActivityType } from '@shared/types/activity';
import { ButtonGroup, DataList, Flex, Heading, Image } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';
import { Link } from 'react-router-dom';
import { Button } from '@theme/button';

interface ActivityInfoProps {
    activity: ActivityRecord;
}

export const ActivityInfo = ({ activity }: ActivityInfoProps) => {
    const platforms = activity.expand?.platforms
        ? activity.expand?.platforms?.map(p => p.name).join(', ')
        : '-';
    const developers = activity.expand?.developers
        ? activity.expand?.developers?.map(d => d.name).join(', ')
        : '-';
    const publishers = activity.expand?.publishers
        ? activity.expand?.publishers?.map(c => c.name).join(', ')
        : '-';
    const genres = activity.expand?.genres
        ? activity.expand?.genres?.map(g => g.name).join(', ')
        : '-';
    const tags = activity.expand?.tags ? activity.expand?.tags?.map(t => t.name).join(', ') : '-';
    const themes = activity.expand?.themes
        ? activity.expand?.themes?.map(t => t.name).join(', ')
        : '-';

    return (
        <>
            <Flex direction="column" align="center">
                <Heading textAlign="center">{activity.name}</Heading>
                <Image src={activity.cover} />
            </Flex>
            {activity.type === ActivityType.Game && (
                <>
                    <DataList.Root
                        orientation="horizontal"
                        divideY="1px"
                        maxW="md"
                        overflowY="auto"
                    >
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Дата выхода</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {activity.release_date &&
                                    formatDateLocalized(activity.release_date)}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Стоимость</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {activity.steam_app_id > 0
                                    ? `${activity.steam_app_price / 100} $`
                                    : '-'}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Время прохождения</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {activity.hltb_id ? `${activity.hltb_campaign_time} ч.` : '-'}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Платформы</DataList.ItemLabel>
                            <DataList.ItemValue>{platforms}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Разработчики</DataList.ItemLabel>
                            <DataList.ItemValue>{developers}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Издатели</DataList.ItemLabel>
                            <DataList.ItemValue>{publishers}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Жанры</DataList.ItemLabel>
                            <DataList.ItemValue>{genres}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Теги</DataList.ItemLabel>
                            <DataList.ItemValue>{tags}</DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Темы</DataList.ItemLabel>
                            <DataList.ItemValue>{themes}</DataList.ItemValue>
                        </DataList.Item>
                    </DataList.Root>
                    <ButtonGroup justify="center" py={4}>
                        {activity.steam_app_id > 0 && (
                            <Button asChild>
                                <Link
                                    to={`https://store.steampowered.com/app/${activity.steam_app_id}`}
                                    target="_blank"
                                >
                                    Steam
                                </Link>
                            </Button>
                        )}
                        {activity.hltb_id > 0 && (
                            <Button asChild>
                                <Link
                                    to={`https://howlongtobeat.com/game/${activity.hltb_id}`}
                                    target="_blank"
                                >
                                    HLTB
                                </Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link
                                to={`https://www.igdb.com/games/${activity.slug}`}
                                target="_blank"
                            >
                                IGDB
                            </Link>
                        </Button>
                    </ButtonGroup>
                </>
            )}
        </>
    );
};
