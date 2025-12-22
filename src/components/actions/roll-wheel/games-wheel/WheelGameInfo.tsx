import type { GameRecord } from '@shared/types/game';
import { ButtonGroup, DataList, Flex, Heading, Image } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';
import { Link } from 'react-router-dom';
import { Button } from '@theme/button';

interface WheelGameInfoProps {
    game: GameRecord;
}

export const WheelGameInfo = ({ game }: WheelGameInfoProps) => {
    const platforms = game.expand?.platforms
        ? game.expand?.platforms?.map(p => p.name).join(', ')
        : '-';
    const developers = game.expand?.developers
        ? game.expand?.developers?.map(d => d.name).join(', ')
        : '-';
    const publishers = game.expand?.publishers
        ? game.expand?.publishers?.map(c => c.name).join(', ')
        : '-';
    const genres = game.expand?.genres ? game.expand?.genres?.map(g => g.name).join(', ') : '-';
    const tags = game.expand?.tags ? game.expand?.tags?.map(t => t.name).join(', ') : '-';

    return (
        <>
            <Flex direction="column" align="center">
                <Heading textAlign="center">{game.name}</Heading>
                <Image src={game.cover} />
            </Flex>
            <DataList.Root orientation="horizontal" divideY="1px" maxW="md" overflowY="auto">
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Дата выхода</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {formatDateLocalized(game.release_date)}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Стоимость</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {game.steam_app_id > 0 ? `${game.steam_app_price / 100} $` : '-'}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Время прохождения</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {game.hltb_id ? `${game.hltb_campaign_time} ч.` : '-'}
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
            </DataList.Root>
            <ButtonGroup justify="center" py={4}>
                {game.steam_app_id > 0 && (
                    <Button asChild>
                        <Link
                            to={`https://store.steampowered.com/app/${game.steam_app_id}`}
                            target="_blank"
                        >
                            Steam
                        </Link>
                    </Button>
                )}
                {game.hltb_id > 0 && (
                    <Button asChild>
                        <Link to={`https://howlongtobeat.com/game/${game.hltb_id}`} target="_blank">
                            HLTB
                        </Link>
                    </Button>
                )}
                <Button asChild>
                    <Link to={`https://www.igdb.com/games/${game.slug}`} target="_blank">
                        IGDB
                    </Link>
                </Button>
            </ButtonGroup>
        </>
    );
};
