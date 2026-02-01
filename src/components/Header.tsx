import { useAppContext } from '@context/AppContext';
import { CollectionListAllProvider } from '@context/CollectionListAllContext/CollectionListAllContext';
import { PlayersFloatingList } from '@components/players-floating-list/PlayersFloatingList';
import { UserMenuAuth } from '@components/user-menu/UserMenuAuth';
import { UserMenuGuest } from '@components/user-menu/UserMenuGuest';
import { ControlsMenu } from '@components/ControlsMenu';

export const Header = () => {
    const { pb, isAuth } = useAppContext();

    return (
        <>
            <CollectionListAllProvider
                collection={pb.collection('users')}
                refetchOnWindowFocus={false}
            >
                <PlayersFloatingList />
            </CollectionListAllProvider>
            {isAuth ? <UserMenuAuth /> : <UserMenuGuest />}
            <ControlsMenu />
        </>
    );
};
