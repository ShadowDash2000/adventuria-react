import { Tooltip } from '@ui/tooltip';
import { Box } from '@chakra-ui/react';
import { ShiftChangeTimer } from '@components/board/actors/npc/ShiftChangeTimer';
import { PlayerAvatar } from '@components/PlayerAvatar';
import type { ActiveNPCActor } from '@shared/query/requests/active-actors';
import type { RefObject } from 'react';

interface ActorNPCProps {
    ref?: RefObject<HTMLDivElement | null>;
    actor: ActiveNPCActor;
}

export const ActorNPC = ({ actor, ref }: ActorNPCProps) => {
    return (
        <Tooltip
            content={
                <Box fontSize="lg">
                    {actor.name} походит через:{' '}
                    <ShiftChangeTimer
                        nextShiftChangeAt={actor.next_shift_change_at}
                        textWrap="nowrap"
                    />
                </Box>
            }
        >
            <PlayerAvatar ref={ref} avatarUrl={actor.avatar} color={actor.color} initial={false} />
        </Tooltip>
    );
};
