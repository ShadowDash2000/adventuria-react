import { Button, ButtonGroup } from '@theme/button';
import { Link } from 'react-router-dom';
import { type ButtonGroupProps } from '@chakra-ui/react';
import { ActivityType } from '@shared/types/activity';

interface ActivityLinkButtonsProps extends ButtonGroupProps {
    activityType: ActivityType;
    steamAppId: number;
    hltbId: number;
    slug: string;
}

export const LinkButtons = ({
    activityType,
    steamAppId,
    hltbId,
    slug,
    ...rest
}: ActivityLinkButtonsProps) => {
    return (
        <ButtonGroup {...rest}>
            {steamAppId > 0 && (
                <Button asChild>
                    <Link to={`https://store.steampowered.com/app/${steamAppId}`} target="_blank">
                        Steam
                    </Link>
                </Button>
            )}
            {hltbId > 0 && (
                <Button asChild>
                    <Link to={`https://howlongtobeat.com/game/${hltbId}`} target="_blank">
                        HLTB
                    </Link>
                </Button>
            )}
            {activityType === ActivityType.Game && (
                <Button asChild>
                    <Link to={`https://www.igdb.com/games/${slug}`} target="_blank">
                        IGDB
                    </Link>
                </Button>
            )}
        </ButtonGroup>
    );
};
