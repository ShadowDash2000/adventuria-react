import { useAppContext } from '@context/AppContext';
import { CollectionListAllProvider } from '@context/CollectionListAllContext/CollectionListAllContext';
import { PlayersFloatingList } from '@components/players-floating-list/PlayersFloatingList';
import { UserMenu } from '@components/user-menu/UserMenu';
import { ControlsMenu } from '@components/ControlsMenu';

export const Header = () => {
    const { pb } = useAppContext();
    const { isAuth } = useAppContext();

    return (
        <>
            <CollectionListAllProvider
                collection={pb.collection('users')}
                refetchOnWindowFocus={false}
            >
                <PlayersFloatingList />
            </CollectionListAllProvider>
            {isAuth && <UserMenu />}
            <ControlsMenu />
        </>
    );
};
