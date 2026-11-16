import { PlayerProfileLink } from '@components/profile/Link';
import { PlayerAvatar } from '@components/PlayerAvatar';
import { ActivePlayerActor } from '@shared/query/requests/active-actors';
import type { RefObject } from 'react';

interface ActorPlayerProps {
    ref?: RefObject<HTMLDivElement | null>;
    actor: ActivePlayerActor;
}

export const ActorPlayer = ({ actor, ref }: ActorPlayerProps) => {
    return (
        <PlayerProfileLink playerName={actor.name}>
            <PlayerAvatar ref={ref} avatarUrl={actor.avatar} color={actor.color} initial={false} />
        </PlayerProfileLink>
    );
};
