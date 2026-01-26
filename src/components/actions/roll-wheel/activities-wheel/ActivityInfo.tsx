import { ActivityRecord, ActivityType } from '@shared/types/activity';
import { DataList, Flex, Heading, Image } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';
import { useAppContext } from '@context/AppContext';
import { ActivityLinkButtons } from '@components/actions/roll-wheel/activities-wheel/ActivityLinkButtons';

interface ActivityInfoProps {
    activity: ActivityRecord;
}

export const ActivityInfo = ({ activity }: ActivityInfoProps) => {
    const { pb } = useAppContext();

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
                <Image src={activity.cover || pb.files.getURL(activity, activity.cover_alt)} />
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
                                {activity.hltb_campaign_time > 0
                                    ? `${activity.hltb_campaign_time} ч.`
                                    : '-'}
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
                    <ActivityLinkButtons activity={activity} justify="center" py={4} />
                </>
            )}
        </>
    );
};
