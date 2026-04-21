import { useAppContext } from '@context/AppContext';
import { PlayersFloatingList } from '@components/players-floating-list/PlayersFloatingList';
import { PlayerMenuAuth } from '@components/player-menu/PlayerMenuAuth';
import { PlayerMenuGuest } from '@components/player-menu/PlayerMenuGuest';
import { ControlsMenu } from '@components/ControlsMenu';

export const Header = () => {
    const { isAuth } = useAppContext();

    return (
        <>
            <PlayersFloatingList />
            {isAuth ? <PlayerMenuAuth /> : <PlayerMenuGuest />}
            <ControlsMenu />
        </>
    );
};
