import { ActivityType } from '@shared/types/activity';
import { DataList, Flex, Heading, Image } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';
import { useAppContext } from '@context/AppContext';
import { LinkButtons } from '@components/actions/roll-wheel/activities-wheel/LinkButtons';
import type { ActivityViewDetailed } from '@components/actions/roll-wheel/activities-wheel/view';

interface ActivityInfoProps {
    activityView: ActivityViewDetailed;
}

export const ActivityInfo = ({ activityView }: ActivityInfoProps) => {
    const { pb } = useAppContext();

    const platforms = activityView.platforms
        ? activityView.platforms?.map(p => p.name).join(', ')
        : '-';
    const developers = activityView.developers
        ? activityView.developers?.map(d => d.name).join(', ')
        : '-';
    const publishers = activityView.publishers
        ? activityView.publishers?.map(c => c.name).join(', ')
        : '-';
    const genres = activityView.genres ? activityView.genres?.map(g => g.name).join(', ') : '-';
    const tags = activityView.tags ? activityView.tags?.map(t => t.name).join(', ') : '-';
    const themes = activityView.themes ? activityView.themes?.map(t => t.name).join(', ') : '-';

    return (
        <>
            <Flex direction="column" align="center">
                <Heading textAlign="center">{activityView.activity.name}</Heading>
                <Image
                    src={
                        activityView.activity.cover ||
                        pb.files.getURL(activityView.activity, activityView.activity.cover_alt)
                    }
                />
            </Flex>
            {activityView.activity.type === ActivityType.Game && (
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
                                {activityView.activity.release_date &&
                                    formatDateLocalized(activityView.activity.release_date)}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Стоимость</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {activityView.activity.steam_app_id > 0
                                    ? `${activityView.activity.steam_app_price / 100} $`
                                    : '-'}
                            </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item pt="4">
                            <DataList.ItemLabel>Время прохождения</DataList.ItemLabel>
                            <DataList.ItemValue>
                                {activityView.activity.hltb_campaign_time > 0
                                    ? `${activityView.activity.hltb_campaign_time} ч.`
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
                    <LinkButtons activity={activityView.activity} justify="center" py={4} />
                </>
            )}
        </>
    );
};
