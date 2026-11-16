import { useAppContext } from '@context/AppContext';
import { ActorsFloatingList } from '@components/actors-floating-list/ActorsFloatingList';
import { PlayerMenuAuth } from '@components/player-menu/PlayerMenuAuth';
import { PlayerMenuGuest } from '@components/player-menu/PlayerMenuGuest';
import { ControlsMenu } from '@components/ControlsMenu';

export const Header = () => {
    const { isAuth } = useAppContext();

    return (
        <>
            <ActorsFloatingList />
            {isAuth ? <PlayerMenuAuth /> : <PlayerMenuGuest />}
            <ControlsMenu />
        </>
    );
};
