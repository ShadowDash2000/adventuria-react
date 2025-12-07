import { type FC, useMemo } from 'react';
import type { GameRecord } from '@shared/types/game';
import { ButtonGroup, DataList, Flex, FlexProps, Heading, Image } from '@chakra-ui/react';
import { formatDateLocalized } from '@shared/helpers/helper';
import { Button } from '@ui/button';
import { Link } from 'react-router-dom';

interface WheeGameInfoProps extends FlexProps {
    game: GameRecord;
}

export const WheeGameInfo: FC<WheeGameInfoProps> = ({ game, ...props }) => {
    const platforms = useMemo(
        () => (game.expand?.platforms ? game.expand?.platforms?.map(p => p.name).join(', ') : '-'),
        [game.expand?.platforms],
    );
    const developers = useMemo(
        () =>
            game.expand?.developers ? game.expand?.developers?.map(d => d.name).join(', ') : '-',
        [game.expand?.developers],
    );
    const publishers = useMemo(
        () =>
            game.expand?.publishers ? game.expand?.publishers?.map(c => c.name).join(', ') : '-',
        [game.expand?.publishers],
    );
    const genres = useMemo(
        () => (game.expand?.genres ? game.expand?.genres?.map(g => g.name).join(', ') : '-'),
        [game.expand?.genres],
    );
    const tags = useMemo(
        () => (game.expand?.tags ? game.expand?.tags?.map(t => t.name).join(', ') : '-'),
        [game.expand?.tags],
    );

    return (
        <Flex {...props}>
            <Flex direction="column" align="center">
                <Heading>{game.name}</Heading>
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
                        {game.steam_app_price > 0 ? `${game.steam_app_price / 100} $` : '-'}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item pt="4">
                    <DataList.ItemLabel>Время прохождения</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {game.campaign_time > 0 ? `${game.campaign_time} ч.` : '-'}
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
        </Flex>
    );
};
