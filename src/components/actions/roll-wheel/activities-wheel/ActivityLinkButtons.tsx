import { Button, ButtonGroup } from '@theme/button';
import { Link } from 'react-router-dom';
import { type ButtonGroupProps } from '@chakra-ui/react';
import { ActivityType, type ActivityRecord } from '@shared/types/activity';

interface ActivityLinkButtonsProps extends ButtonGroupProps {
    activity: ActivityRecord;
}

export const ActivityLinkButtons = ({ activity, ...rest }: ActivityLinkButtonsProps) => {
    return (
        <ButtonGroup {...rest}>
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
                    <Link to={`https://howlongtobeat.com/game/${activity.hltb_id}`} target="_blank">
                        HLTB
                    </Link>
                </Button>
            )}
            {activity.type === ActivityType.Game && (
                <Button asChild>
                    <Link to={`https://www.igdb.com/games/${activity.slug}`} target="_blank">
                        IGDB
                    </Link>
                </Button>
            )}
        </ButtonGroup>
    );
};
